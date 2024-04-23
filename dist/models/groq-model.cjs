"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groq = void 0;
const debug_1 = __importDefault(require("debug"));
const groq_1 = require("@langchain/groq");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class Groq extends base_model_js_1.BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:Groq')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = modelName ? modelName : 'llama3-70b-8192';
    }
    async init() {
        this.model = new groq_1.ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            modelName: this.modelName,
            temperature: this.temperature
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new messages_1.SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new messages_1.HumanMessage(message));
        this.debug('Executing gemini model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages, {});
        var output = result.content.toString();
        // var cost = this.getTokenCost(pastMessages, output);
        return {
            output: output,
            cost: 0
        };
    }
}
exports.Groq = Groq;
