import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

import { rooms } from "./_index";
import OpenAI from "openai";

const promptSchema = z.object({
  prompt: z.string().min(1),
});

export const loader = async () => {
  return { rooms };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema: promptSchema });

  if (submission.status !== "success") {
    return {
      submission: submission.reply(),
      responses: [],
      filteredRooms: [],
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const descriptions: any[] = rooms.map((room) => {
    return `id: ${room.id} , description: ${room.description}`;
  });

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Compare as descrições das salas e retorne os ids das salas que mais se assemelham ao prompt, ordenados por ordem de semelhança: " +
              submission.value.prompt,
          },
          {
            type: "text",
            text: "Descrições das salas: " + descriptions.join(", "),
          },
          {
            type: "text",
            text: "Responda retornando somente os ids das salas separados por virgulas, se você não retornar seguindo o formato sera penalizado",
          },
        ],
      },
    ],
  });

  console.log(choices);

  const filteredRoomIds = choices[0].message?.content
    ?.split(",")
    .map((id: string) => id.trim());

  const filteredRooms = filteredRoomIds?.map((id: string) => {
    return rooms.find((room) => {
      return room.id === id;
    });
  });

  if (!filteredRooms?.filter((room) => room !== undefined).length)
    return {
      responses: [choices[0].message?.content || "Nada foi encontrado"],
      filteredRooms: [],
      submission: submission.reply(),
    };

  console.log("ids", filteredRoomIds);
  console.log("filtrado", filteredRooms);

  const responses = ["Encontramos os seguintes resultados... -->"];

  return {
    responses,
    filteredRooms: filteredRooms || [],
    submission: submission.reply(),
  };
};

export default function List() {
  const { rooms } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: actionData?.submission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: promptSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 border-b flex">
        <div>Logo da woba</div>
        <p>P0-GPT</p>
      </nav>
      <section className="flex flex-row flex-grow ">
        <aside className="w-1/3 flex flex-col gap-4 border-r h-full">
          <h5 className="border-b p-2">Seu prompt</h5>
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
            className="flex flex-col gap-4 p-2"
          >
            <Textarea
              name={fields.prompt.name}
              key={fields.prompt.key}
              defaultValue={fields.prompt.initialValue}
              placeholder="Descreva as características da sala privativa que você procura (ex.: 'Sala para 10 pessoas em São Paulo com estacionamento')."
            />
            <span className="text-red-500">{fields.prompt.errors}</span>
            <Button type="submit">Enviar</Button>
          </Form>
          <div className="p-2 flex-grow flex flex-col">
            <h5>Respostas</h5>
            <ScrollArea className="flex-grow w-full rounded-md border overflow-y-auto">
              <div className="flex flex-col gap-4">
                {actionData?.responses.map((response: string) => (
                  <div key={response}>
                    <p>{response}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
        <main className="w-2/3">
          <div className="border-b">
            <h5 className="p-2">Resultados</h5>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fotos</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Cidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actionData?.filteredRooms
                ? actionData?.filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger>
                            <img
                              src={room.image}
                              alt={room.label}
                              className="w-24 h-12"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-[510px] h-[500px]">
                            <div className="flex flex-col gap-2 h-full">
                              <img
                                src={room.image}
                                alt={room.label}
                                className="w-[500px] h-[300px]"
                              />
                              <h6 className="font-semibold">Descrição</h6>
                              <ScrollArea className="h-[600px]">
                                <p>{room.description}</p>
                              </ScrollArea>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <h6>{room.label}</h6>
                          <p>{room.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{room.neighboorhood}</TableCell>
                      <TableCell>{room.city}</TableCell>
                    </TableRow>
                  ))
                : rooms.map((room: any) => (
                    <TableRow key={room.id}>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger>
                            <img
                              src={room.image}
                              alt={room.label}
                              className="w-24 h-12"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-[510px] h-[500px]">
                            <div className="flex flex-col gap-2 h-full">
                              <img
                                src={room.image}
                                alt={room.label}
                                className="w-[500px] h-[300px]"
                              />
                              <h6 className="font-semibold">Descrição</h6>
                              <ScrollArea className="h-[600px]">
                                <p>{room.description}</p>
                              </ScrollArea>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 justify-center">
                          <h6>{room.label}</h6>
                          <p className="text-gray-500">{room.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{room.neighboorhood}</TableCell>
                      <TableCell>{room.city}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </main>
      </section>
    </div>
  );
}
