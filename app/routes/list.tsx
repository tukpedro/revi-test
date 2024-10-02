import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { ActionFunctionArgs } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"

const promptSchema = z.object({
    prompt: z.string().min(1),
});

export const loader = async ({ request }: ActionFunctionArgs) => {
    const room = [{
        id: 1,
        name: "Room 1",
        neighboorhood: "Neighborhood 1",
        city: "City 1",
        image: "/placeholder.svg"
    }, {
        id: 2,
        name: "Room 2",
        neighboorhood: "Neighborhood 1",
        city: "City 1",
        image: "/placeholder.svg"
    },{
        id: 3,
        name: "Room 3",
        neighboorhood: "Neighborhood 1",
        city: "City 1",
        image: "/placeholder.svg"
    },{
        id: 4,
        name: "Room 4",
        neighboorhood: "Neighborhood 1",
        city: "City 1",
        image: "/placeholder.svg"
    }]
    return { room }
}

export const action = async ({ request }: ActionFunctionArgs) => {

  const formData = await request.clone().formData();
  const submission = parseWithZod(formData, { schema: promptSchema });

  if (submission.status !== "success") {
    return {
        submission: submission.reply(),
        responses: [],
        filteredRooms: []
    }
  }
    const responses = ["lorem", "ipsum", "dolor", "sit", "amet"]

    const filteredRooms = [{
        id: 1,
        name: "Filtered Room 1",
        neighboorhood: "Neighborhood 1",
        city: "City 1",
        image: "/placeholder.svg"
    }]
    
    return { responses, filteredRooms , submission: submission.reply()}
}

export default function List() {
    const { room } = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
  
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
            <Form method="post" id={form.id} onSubmit={form.onSubmit} noValidate className="flex flex-col gap-4 p-2">
                <Input 
                name={fields.prompt.name}
                key={fields.prompt.key}
                defaultValue={fields.prompt.initialValue}
                type="text" placeholder="Digite seu prompt" />
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
            <ul className="grid grid-cols-4 gap-4 p-2">
                {actionData?.filteredRooms && actionData?.filteredRooms.length > 0 ? (
                    actionData?.filteredRooms.map((room) => (
                        <li key={room.id} className="flex flex-col gap-2">
                            <img src={room.image} alt={room.name} className="w-80 h-48" />
                            <h6>{room.name}</h6>
                            <div className="flex flex-row gap-2 text-gray-500">
                                <p>{room.neighboorhood}</p>
                                <p>{room.city}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    room.map((room) => (
                        <li key={room.id} className="flex flex-col gap-2">
                            <img src={room.image} alt={room.name} className="w-80 h-48" />
                            <h6>{room.name}</h6>
                            <div className="flex flex-row gap-4 text-gray-500">
                                <p>{room.neighboorhood}</p>
                                <p>{room.city}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </main>
    </section>
</div>

    )
}