import express, { json } from "express"
import { v4 } from "uuid"
import cors from 'cors'


const port = 3001
const app = express()
app.use(json())
app.use(cors())


const listOrders = []

const checkUrlMetho = (request, response, next) => {
    console.log(request.url)
    console.log(request.method)

    next()
}

const checkOrders = (request, response, next) => {
    const { id } = request.params

    const index = listOrders.findIndex(client => client.id === id)

    if (index < 0) {
        return response.status(404).json({ Error: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

app.get("/orders", checkUrlMetho, (request, response) => {

    return response.json(listOrders)
})

app.post("/orders", checkUrlMetho, (request, response) => {
    const { order, clientName } = request.body

    const list = { id: v4(), order, clientName }

    listOrders.push(list)

    return response.status(201).json(list)
})

app.put("/orders/:id", checkOrders, checkUrlMetho, (request, response) => {
    const { order, clientName, price, } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const amendedOrder = { id, order, clientName, price, "status": "Pedido alterado. Em preparação." }

    listOrders[index] = amendedOrder

    return response.json([amendedOrder])
})

app.delete("/orders/:id", checkOrders, checkUrlMetho, (request, response) => {
    const index = request.orderIndex

    listOrders.splice(index, 1)

    return response.status(204).json()

})

app.patch("/orders/:id", checkOrders, checkUrlMetho, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const statusReady = { id, order, clientName, price, "status": "Pronto" }

    listOrders[index] = statusReady

    return response.json([statusReady])
})

app.get("/orders/:id", checkOrders, checkUrlMetho, (request, response) => {
    const id = request.orderId

    const index = listOrders.find(order => order.id === id)

    return response.json([index])
})


app.listen(port, () => {
    console.log(`✨ Server started on port: ${port} ✨`)
})

