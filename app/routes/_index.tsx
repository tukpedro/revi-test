import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { useForm } from "@conform-to/react";
import { useState } from "react";
import { cn } from "~/lib/utils";

const roomSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  spaceId: z.number(),
  city: z.string(),
  tier: z.string(),
  // capacity: z.number(),
  size: z.string(),
  credits: z.number(),
  status: z.number(),
  image: z.string().min(1),
  lat: z.string(),
  long: z.string(),
});


export const config = {
  maxDuration: 60,
};

export var rooms: any[] = [];

export const loader = () => {
  return {rooms};
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: roomSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const openai = new OpenAI({
    timeout: 20000,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { image } = submission.value;

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { 
            type: "text", 
            text: "Você é um vendedor especializado em escritórios privativos e está encarregado de cadastrar salas em uma plataforma de anúncios. Seu objetivo é gerar uma descrição detalhada da sala, utilizando as informações fornecidas em um JSON e nas imagens associadas ao espaço. A descrição deve ser atraente para potenciais clientes e fornecer uma visão clara do que a sala oferece, sem utilizar nenhuma formatação especial (como listas, negrito, itálico, etc.). Descreva o tamanho, capacidade e configuração da sala, comparando se a capacidade mencionada no JSON condiz com as imagens. Indique se o espaço pode acomodar mais pessoas do que o especificado e a partir da imagem. Utilize as coordenadas de latitude e longitude para listar pontos de referência próximos, como estações de metrô, paradas de ônibus, comércios, e a distância até esses locais. Baseie-se nas imagens fornecidas para descrever as características visuais do espaço, como iluminação, disposição do mobiliário, tipo de piso e equipamentos disponíveis (ex.: ar-condicionado, projetores, TVs, armários, decorações, etc). Agrupe as descrições de forma coerente e conectada, sempre considerando que todas as imagens são do mesmo espaço. Avalie o nível de silêncio e privacidade do ambiente com base na estrutura visível nas imagens e mencione facilidades de acesso, como elevadores ou proximidade com transporte público a partir dos pontos de referência. Use um tom profissional e informativo, destacando os principais atrativos da sala, sem recorrer a listas ou qualquer tipo de formatação textual. O resultado esperado é um texto contínuo, sem formatação, que descreva de maneira clara e envolvente as características da sala, com detalhamento geográfico preciso, destacando os pontos de referência próximos e suas distâncias. A descrição das imagens deve ser agrupada logicamente, sem listas ou tópicos, e deve incluir a avaliação cuidadosa das amenidades visíveis, destacando os benefícios práticos da sala. Não se espera que o texto tenha qualquer tipo de formatação, como negrito, listas ou tópicos, ou que seja curto ou sem detalhamento suficiente, além de não omitir aspectos importantes como localização geográfica, pontos de referência, capacidade da sala e análise das imagens"
          },
          {
            type: "text",
            text: JSON.stringify(submission.value),          
          },
          { 
            type: "image_url",
            image_url: {
              "url": image,
            },
          },
        ],
      },
    ],
  })

  console.log(choices[0])

  rooms.push({...submission.value, description: choices[0].message.content});

  return submission.reply();
}

export default function Index() {
  const { rooms } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: roomSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      label: "sala 1",
      spaceId: "1",
      city: "sao paulo",
      tier: "1",
      size: "2",
      credits: "1",
      status: "1",
      image: "https://d1y4va1nna2r1p.cloudfront.net/spaces/7313ef2d-d0ae-4cdc-8f8a-496e1dc83198.jpeg",
      lat: "-23.556290568479188",
      long: "-46.66699512214109",
    }
  });

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="grid gap-8">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Criar Sala</h1>
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
            className="grid grid-cols-2 gap-4"
          >
            <input type="hidden" name="id" value={uuidv4()} />
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="name"
                key={fields.label.key}
                name={fields.label.name}
                defaultValue={fields.label.initialValue}
                placeholder="Preencha com o nome da sala"
              />
              <span className="text-red-500">{fields.label.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spaceId">SpaceId</Label>
              <Input
                id="name"
                key={fields.spaceId.key}
                name={fields.spaceId.name}
                defaultValue={fields.spaceId.initialValue}
                placeholder="Preencha com Id do espaço"
              />
              <span className="text-red-500">{fields.spaceId.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                key={fields.city.key}
                name={fields.city.name}
                defaultValue={fields.city.initialValue}
                id="city"
                placeholder="Preencha com a cidade da sala"
              />
              <span className="text-red-500">{fields.city.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Input
                key={fields.tier.key}
                name={fields.tier.name}
                defaultValue={fields.tier.initialValue}
                id="tier"
                placeholder="Preencha com Tier"
              />
              <span className="text-red-500">{fields.tier.errors}</span>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                key={fields.capacity.key}
                name={fields.capacity.name}
                defaultValue={fields.capacity.initialValue}
                id="capacity"
                type="number"
                placeholder="Preencha com a capacidade da sala"
              />
              <span className="text-red-500">{fields.capacity.errors}</span>
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                key={fields.size.key}
                name={fields.size.name}
                defaultValue={fields.size.initialValue}
                id="size"
                placeholder="Preencha com o tamanho da sala"
              />
              <span className="text-red-500">{fields.size.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                key={fields.credits.key}
                name={fields.credits.name}
                defaultValue={fields.credits.initialValue}
                id="credits"
                type="number"
                placeholder="Preencha com a quantidade de Creditos"
              />
              <span className="text-red-500">{fields.credits.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                key={fields.status.key}
                name={fields.status.name}
                defaultValue={fields.status.initialValue}
                id="status"
                type="number"
                placeholder="Preencha com o status da sala"
              />
              <span className="text-red-500">{fields.status.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lat">Lat</Label>
              <Input
                key={fields.lat.key}
                name={fields.lat.name}
                defaultValue={fields.lat.initialValue}
                id="status"
                type="number"
                placeholder="Preencha com a latitude da sala"
              />
              <span className="text-red-500">{fields.lat.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="long">Long</Label>
              <Input
                key={fields.long.key}
                name={fields.long.name}
                defaultValue={fields.long.initialValue}
                id="status"
                type="number"
                placeholder="Preencha com a longitude da sala"
              />
              <span className="text-red-500">{fields.long.errors}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                key={fields.image.key}
                name={fields.image.name}
                defaultValue={fields.image.initialValue}
                id="image"
                placeholder="Preencha com a URL da imagem"
              />
              <span className="text-red-500">{fields.image.errors}</span>
            </div>
            <div className="mt-6 flex">
              <Button type="submit">Salvar sala</Button>
            </div>
          </Form>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold mb-4">Salas criadas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(({ label, id, image }) => (
              <Card key={id} className="space-y-2">
                <Card
                  className={cn(
                    "cursor-pointer",
                  )}
                  key={id}
                >
                  <img
                    src={image}
                    width={200}
                    height={200}
                    alt="Monster"
                    className="rounded-t-lg object-cover w-full aspect-square"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{label}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {/* <div>
                        <span className="font-medium">Attack:</span> {attack}
                      </div>
                      <div>
                        <span className="font-medium">Defense:</span> {defense}
                      </div>
                      <div>
                        <span className="font-medium">Speed:</span> {speed}
                      </div>
                      <div>
                        <span className="font-medium">HP:</span> {hp}
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
