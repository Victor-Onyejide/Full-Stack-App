"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const fs_1 = require("fs");
// import {List, Data} from '..../types/types.ts'
const DATABASE = './src/database/database.json';
function readList() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(DATABASE);
        const parse_data = JSON.parse(data.toString());
        return parse_data;
    });
}
function writeList(data) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.promises.writeFile(DATABASE, JSON.stringify(data));
    });
}
const getList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield readList();
        let { list } = data;
        res.status(200).json(list);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
const creatTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todo } = req.body;
    try {
        let data = yield readList();
        let { list } = data;
        let item = {
            id: (0, uuid_1.v4)(),
            todo: todo
        };
        list.push(item);
        const find_list = list.find((i) => i.id === item.id);
        yield writeList(data);
        res.status(200).json(find_list);
    }
    catch (err) {
        res.status(404).json(err);
    }
});
const updateList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { todo } = req.body;
    try {
        let data = yield readList();
        let { list } = data;
        list = list.map((item) => (item.id === id ? { id, todo } : item));
        data.list = list;
        yield writeList(data);
        res.status(202).json({ id, todo });
    }
    catch (err) {
        res.status(404).json(err);
    }
});
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id }: any = req.params;
    let id = ['35249fe2-e0a0-4449-8f32-2dbd2fa1da96', 'b870fb4a-dde5-48c1-b4e6-c25e3283ab03', 'c2959bb7-106c-4db8-8350-27193b4d580c'];
    try {
        let data = yield readList();
        let { list } = data;
        let i = 0;
        for (i; i < id.length; i++) {
            list = list.filter((item) => item.id !== id[i]);
        }
        data.list = list;
        yield writeList(data);
        res.status(202).json(id);
    }
    catch (error) {
        res.status(404).json(error);
    }
});
module.exports = {
    getList,
    creatTodo,
    updateList,
    deleteTodo
};
