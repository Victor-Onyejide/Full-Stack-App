import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs'
// import {List, Data} from '..../types/types.ts'

const DATABASE = './src/database/database.json'


interface List {
    id: string,
    todo: string
}

type Data = {
    list: List[]
}

async function readList(): Promise<Data> {
    const data = await fs.readFile(DATABASE)
    const parse_data: Data = JSON.parse(data.toString())
    return parse_data
    // return list
}

async function writeList(data: Data) {
    fs.writeFile(DATABASE, JSON.stringify(data))

}

const getList = async (req: Request, res: Response) => {
    try {
        let data = await readList()
        let { list } = data
        res.status(200).json(list)

    } catch (err) {
        res.status(404).json(err)
    }
}

const creatTodo = async (req: Request, res: Response) => {
    const { todo } = req.body
    
    try {
        let data = await readList()
        let { list } = data

        let item: List = {
            id: uuidv4(),
            todo: todo
        }

        list.push(item)
        
        const find_list = list.find((i) => i.id === item.id)

        await writeList(data)
        
        res.status(200).json(find_list)

    }
    catch (err) {
        res.status(404).json(err)
    }
}

const updateList = async (req: Request, res: Response) => {
    const { id } = req.params
    const { todo } = req.body
    try {
        let data = await readList()
        let { list } = data
        list = list.map((item) => (item.id === id ? { id, todo } : item))

        data.list = list

        await writeList(data)

        res.status(202).json({ id, todo })
    }
    catch (err) {
        res.status(404).json(err)
    }
}

const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        let data = await readList();
        let { list } = data;


        list = list.filter((item) => item.id !== id)

        data.list = list

        await writeList(data)
        res.status(202).json(id)
    } catch (error) {

        res.status(404).json(error)
    }
}

module.exports = {
    getList,
    creatTodo,
    updateList,
    deleteTodo
}