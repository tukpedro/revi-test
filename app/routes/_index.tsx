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
  Link,
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

export var rooms: any[] = [
  {
    id: "1",
    label: "Sala Sao paulo paulista",
    spaceId: 1,
    city: "São Paulo",
    tier: "1",
    // capacity: 10,
    size: "2",
    credits: 1,
    status: 1,
    image:
      "https://d1y4va1nna2r1p.cloudfront.net/spaces/7313ef2d-d0ae-4cdc-8f8a-496e1dc83198.jpeg",
    lat: "-23,556290568479188",
    long: "-46,66699512214109",
    description:
      "Esta sala privativa está localizada na vibrante cidade de São Paulo, destacando-se como um espaço ideal para profissionais que buscam um ambiente de trabalho moderno e bem equipado. A sala possui um tamanho regular e, de acordo com o JSON fornecido, a capacidade é de duas pessoas. No entanto, observando a imagem, é possível perceber que a sala oferece acomodações para mais pessoas, suportando confortavelmente até quatro ocupantes, graças aos dois conjuntos de mesas com cadeiras ergonômicas. A iluminação natural é um dos pontos fortes desta sala, proporcionada por amplas janelas que permitem a entrada de luz solar, criando um ambiente agradável e arejado. As janelas também oferecem uma vista panorâmica da paisagem urbana de São Paulo, adicionando um toque de sofisticação ao espaço. O piso é de madeira, conferindo um aspecto acolhedor e sofisticado, enquanto as paredes de vidro integram o espaço de forma elegante, garantindo privacidade, mas sem criar uma sensação de isolamento. O espaço está totalmente equipado com ar-condicionado central, garantindo um ambiente de trabalho confortável durante todo o ano. Além disso, a presença de luminárias embutidas no teto assegura uma iluminação uniforme e adequada para tarefas de escritório. O interior da sala é bem planejado, com cadeiras de escritório de alto padrão e mesas funcionais que permitem a organização eficiente do espaço de trabalho. A localização desta sala é outro grande diferencial. Situada nas coordenadas -23.556290568479188 de latitude e -46.66699512214109 de longitude, o escritório encontra-se bem servido por transporte público. A poucos minutos de caminhada, é possível acessar estações de metrô, como a Estação Paulista (aproximadamente 10 minutos a pé), além de diversas paradas de ônibus nas proximidades. Na redondeza, há uma variedade de comércios, como restaurantes, cafés e lojas, oferecendo diversas opções para pausas e refeições rápidas. Também é notável a estrutura do prédio onde a sala está situada. A entrada do edifício é moderna e sofisticada, com elevadores rápidos que facilitam o acesso ao andar onde a sala se encontra. A segurança é garantida, com recepção eficiente e sistema de monitoramento. O nível de silêncio da sala parece ser adequado para um ambiente de trabalho, dado que as divisórias de vidro são espessas o suficiente para abafar ruídos externos, promovendo um ambiente tranquilo e produtivo. Em resumo, esta sala privativa em São Paulo oferece uma excelente combinação de conforto, modernidade e localização estratégica, tornando-se uma opção ideal para profissionais e empresas que valorizam um ambiente de trabalho de alta qualidade.",
  },
  {
    id: "2",
    label: "Sala 2",
    spaceId: 2,
    city: "Curitiba",
    tier: "1",
    // capacity: 10,
    size: "2",
    credits: 1,
    status: 1,
    image:
      "https://d1y4va1nna2r1p.cloudfront.net/spaces/a7900645-deb1-4663-a860-0b9449870d98.jpeg",
    lat: "-23.658554576856247",
    long: "-46.71524870147762",
    description:
      "Localizada no coração de Curitiba, esta sala privativa oferece um ambiente de trabalho bem iluminado e organizado. Medindo aproximadamente 20 metros quadrados, o espaço é compacto, mas otimizado para acomodar confortavelmente até quatro pessoas, como mostrado na imagem. A sala está equipada com mesas modernas, cadeiras ergonômicas e um ar-condicionado eficiente, garantindo conforto térmico o ano todo. As amplas janelas proporcionam excelente iluminação natural, criando um ambiente de trabalho agradável e produtivo. Além disso, a sala oferece diversos equipamentos essenciais, como computadores e impressoras, visíveis na imagem, facilitando o dia a dia dos usuários. Localizada nas coordenadas -25.44937163166503, -49.26309935910025, a sala está em uma região com boas opções de transporte público e serviços. A apenas alguns minutos a pé, encontram-se estações de metrô e paradas de ônibus, permitindo fácil acesso a partir de várias partes da cidade. Nas proximidades, há também uma variedade de comércios, incluindo cafés, restaurantes e lojas, ideal para pequenos intervalos ou reuniões informais fora do escritório. O ambiente oferece um nível razoável de silêncio e privacidade, indicado pela disposição das mesas e portas sólidas, ideal para concentrações em tarefas mais complexas. A área é bem acessível, contando com elevadores em edifícios vizinhos e fácil conexão com o transporte público, o que facilita o deslocamento cotidiano. Esta sala é uma ótima escolha para equipes pequenas que buscam um local funcional e bem localizado em Curitiba.",
  },
  {
    id: "3",
    label: "Sala 3",
    spaceId: 3,
    city: "São Paulo",
    tier: "1",
    // capacity: 10,
    size: "2",
    credits: 1,
    status: 1,
    image:
      "https://d1y4va1nna2r1p.cloudfront.net/spaces/fb7f2ca3-1a24-4ff6-91ab-13fe8280a34a.jpeg",
    lat: "-25.453523003319376",
    long: "-49.275641519244594",
    description:
      "Esta sala privativa em São Paulo é ideal para quem busca um ambiente de trabalho tranquilo e bem configurado. Localizada em uma área privilegiada, a proximidade com importantes pontos de referência transforma este espaço numa excelente escolha para profissionais. O ambiente, descrito como uma sala com capacidade para duas pessoas, revela, através da imagem, uma disposição que pode acomodar confortavelmente até quatro pessoas, graças à disposição dos móveis. Estão disponíveis quatro cadeiras executivas, dispostas em torno de duas mesas brancas de formato retangular, proporcionando uma ótima configuração para reuniões ou trabalho colaborativo. As paredes brancas contribuem para uma atmosfera iluminada e limpa, complementadas por uma janela com persianas de madeira que permitem ajuste de luz natural conforme a necessidade. O piso é de madeira, proporcionando um toque de sofisticação e calor ao ambiente. A sala exibe uma decoração minimalista e inspiradora, com frases motivacionais nas paredes que adicionam personalidade ao espaço sem comprometer a profissionalidade. A presença de uma janela amplia a sensação de amplitude e permite a entrada de luz natural, fundamental para um espaço de trabalho saudável e produtivo. Baseado na imagem, não são visíveis equipamentos específicos como projetores ou TVs, o que sugere um espaço mais voltado ao trabalho individual ou pequenas reuniões. Existe um nível de silêncio adequado aparente, favorecido por portas fechadas e a disposição interna dos móveis, indicando boa privacidade. No que diz respeito à localização, o escritório se beneficia de ótimos acessos, localizado precisamente nas coordenadas -23.616154006561896 e -46.77802079143424. Próximo a este local, encontram-se várias facilidades que enriquecem o dia a dia dos profissionais. A poucos minutos de caminhada, estão disponíveis estações de metrô e paradas de ônibus que conectam a diferentes pontos da cidade de São Paulo, tornando o transporte público uma opção eficiente e pratica. Além disso, a área é servida por uma boa variedade de comércios, como restaurantes, cafés e lojas que oferecem conveniência e opções variadas para pausas durante o expediente. Em resumo, esta sala privativa oferece um espaço funcional e esteticamente agradável, com capacidade para acomodar mais do que as duas pessoas mencionadas, comportando até quatro com conforto. A localização estratégica perto de transporte público e comércios, juntamente com um mobiliário confortável e iluminado, fazem deste espaço uma excelente opção para profissionais que buscam um local de trabalho eficiente e agradável.",
  },
  {
    id: "4",
    label: "Sala 4",
    spaceId: 4,
    city: "Manaus",
    tier: "1",
    // capacity: 10,
    size: "2",
    credits: 1,
    status: 1,
    image:
      "https://d1y4va1nna2r1p.cloudfront.net/spaces/5b50a9b0-a46b-4c7a-a788-9796287783d1.jpeg",
    lat: "-3.0852482425593797",
    long: "-60.012040188984706",
    description:
      "Localizada em Manaus, esta sala privativa é uma excelente escolha para quem busca um espaço de trabalho funcional e bem equipado. Com base nas imagens, a sala é cuidadosamente organizada e oferece acomodações para aproximadamente seis pessoas, com cadeiras modernas e confortáveis dispostas ao redor de uma mesa ampla. Essa capacidade, observada nas imagens, sugere que o espaço pode acomodar mais pessoas do que poderia inicialmente parecer a partir do tamanho abstrato mencionado. Visualmente, a sala é bem iluminada, com uma decoração contemporânea que inclui um quadro artístico e plantas decorativas, proporcionando um ambiente acolhedor e inspirador. Está equipada com uma televisão grande instalada na parede, ideal para apresentações ou videoconferências, além de um sistema de comunicação moderno sobre a mesa. O piso é acarpetado, contribuindo para o nível de conforto e absorção sonora, o que pode melhorar o nível de silêncio e privacidade do ambiente. Geograficamente, a sala está situada em um ponto estratégico de Manaus, com coordenadas de latitude -3.0722335327600967 e longitude -59.99171794480425. Esta localização oferece proximidade com importantes pontos de referência, como shoppings, restaurantes e centros comerciais, além de estar próxima a paradas de transporte público, o que facilita o acesso ao espaço. A presença de facilidades como elevadores e pontos de transporte próximo aumenta ainda mais a conveniência para usuários do espaço. Em resumo, este espaço não só atende às necessidades práticas de um ambiente de trabalho moderno, como também oferece uma excelente experiência estética e funcional para aqueles que buscam um local de trabalho colaborativo e acessível, com a vantagem adicional de uma localização bem conectada dentro da cidade de Manaus.",
  },
];

export const loader = () => {
  return { rooms };
};

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
            text: "Você é um vendedor especializado em escritórios privativos e está encarregado de cadastrar salas em uma plataforma de anúncios. Seu objetivo é gerar uma descrição detalhada da sala, utilizando as informações fornecidas em um JSON e nas imagens associadas ao espaço. A descrição deve ser atraente para potenciais clientes e fornecer uma visão clara do que a sala oferece, sem utilizar nenhuma formatação especial (como listas, negrito, itálico, etc.). Descreva o tamanho, capacidade e configuração da sala, comparando se a capacidade mencionada no JSON condiz com as imagens. Indique se o espaço pode acomodar mais pessoas do que o especificado e a partir da imagem. Utilize as coordenadas de latitude e longitude para listar pontos de referência próximos, como estações de metrô, paradas de ônibus, comércios, e a distância até esses locais. Baseie-se nas imagens fornecidas para descrever as características visuais do espaço, como iluminação, disposição do mobiliário, tipo de piso e equipamentos disponíveis (ex.: ar-condicionado, projetores, TVs, armários, decorações, etc). Agrupe as descrições de forma coerente e conectada, sempre considerando que todas as imagens são do mesmo espaço. Avalie o nível de silêncio e privacidade do ambiente com base na estrutura visível nas imagens e mencione facilidades de acesso, como elevadores ou proximidade com transporte público a partir dos pontos de referência. Use um tom profissional e informativo, destacando os principais atrativos da sala, sem recorrer a listas ou qualquer tipo de formatação textual. O resultado esperado é um texto contínuo, sem formatação, que descreva de maneira clara e envolvente as características da sala, com detalhamento geográfico preciso, destacando os pontos de referência próximos e suas distâncias. A descrição das imagens deve ser agrupada logicamente, sem listas ou tópicos, e deve incluir a avaliação cuidadosa das amenidades visíveis, destacando os benefícios práticos da sala. Não se espera que o texto tenha qualquer tipo de formatação, como negrito, listas ou tópicos, ou que seja curto ou sem detalhamento suficiente, além de não omitir aspectos importantes como localização geográfica, pontos de referência, capacidade da sala e análise das imagens",
          },
          {
            type: "text",
            text: JSON.stringify(submission.value),
          },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
  });

  console.log(choices[0]);

  rooms.push({ ...submission.value, description: choices[0].message.content });

  return submission.reply();
};

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
      image:
        "https://d1y4va1nna2r1p.cloudfront.net/spaces/7313ef2d-d0ae-4cdc-8f8a-496e1dc83198.jpeg",
      lat: "-23.556290568479188",
      long: "-46.66699512214109",
    },
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
            <Link to="/list">lista</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(({ label, id, image }) => (
              <Card key={id} className="space-y-2">
                <Card className={cn("cursor-pointer")} key={id}>
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
