import createDebugMessages from 'debug';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';

export class Groq extends BaseModel {
    private readonly debug = createDebugMessages('embedjs:model:Groq');
    private readonly modelName: string;
    private model: ChatGroq;

    constructor({ temperature, modelName }: { temperature?: number; modelName: string }) {
        super(temperature);
        this.modelName = modelName ? modelName : 'llama3-70b-8192';
    }

    override async init(): Promise<void> {
        this.model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            modelName: this.modelName,
            temperature: this.temperature
        });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [new SystemMessage(system)];
        
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
