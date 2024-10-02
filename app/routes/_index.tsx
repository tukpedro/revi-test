import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";

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
  neighborhood: z.string(),
  city: z.string(),
  tier: z.string(),
  capacity: z.number(),
  size: z.string(),
  credits: z.number(),
  status: z.number(),
  image: z.string().min(1),
});

export const monstersSchema = z.array(roomSchema);

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

  rooms.push(submission.value);

  return submission.reply();
}

export default function Index() {
  const { rooms } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>([]);
  const navigate = useNavigate();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: roomSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
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
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                key={fields.neighborhood.key}
                name={fields.neighborhood.name}
                defaultValue={fields.neighborhood.initialValue}
                id="neighborhood"
                placeholder="Preencha com o bairro da sala"
              />
              <span className="text-red-500">{fields.neighborhood.errors}</span>
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
            <div className="space-y-2">
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
            </div>
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
                    `${selectedMonsters.includes(id) ? "bg-blue-500" : ""}`,
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
