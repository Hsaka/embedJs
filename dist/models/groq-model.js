import createDebugMessages from 'debug';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class Groq extends BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:Groq')
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
        this.model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            modelName: this.modelName,
            temperature: this.temperature
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new HumanMessage(message));
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
