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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const fs_1 = require("fs");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5000;
const DATABASE = './src/database/database.json';
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(express_1.default.json());
function readList() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs_1.promises.readFile(DATABASE);
        const parse_data = JSON.parse(data.toString());
        return parse_data;
        // return list
    });
}
function writeList(data) {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.promises.writeFile(DATABASE, JSON.stringify(data));
    });
}
app.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let data = yield readList();
        let { list } = data;
        res.status(200).json(list);
    }
    catch (err) {
        res.status(404).json(err);
    }
}))
    .post('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todo } = req.body;
    try {
        let data = yield readList();
        let { list } = data;
        let item = {
            id: (0, uuid_1.v4)(),
            todo: todo
        };
        list.push(item);
        yield writeList(data);
        res.status(200).json('Success');
    }
    catch (err) {
        res.status(404).json(err);
    }
}))
    .patch('/list/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { todo } = req.body;
    try {
        let data = yield readList();
        let { list } = data;
        list = list.map((item) => (item.id === id ? { id, todo } : item));
        data.list = list;
        yield writeList(data);
        res.status(202).json(data);
    }
    catch (err) {
        res.status(404).json(err);
    }
}))
    .delete('/list/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        let data = yield readList();
        let { list } = data;
        list = list.filter((item) => item.id !== id);
        data.list = list;
        yield writeList(data);
        res.status(202).json(data);
    }
    catch (error) {
        res.status(404).json(error);
    }
}));
const start = () => {
    try {
        app.listen(PORT, () => console.log(`Running on port ${PORT}`));
    }
    catch (err) {
        console.log(err);
    }
};
start();
