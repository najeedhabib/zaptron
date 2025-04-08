import OpenAI from 'openai';
import {Lead} from "../types/lead";
import dotenv from "dotenv";
import {getPrompt} from "./prompt";
import {leads} from "../mocks/leads";
dotenv.config()
const client = new OpenAI({
                            apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
                          });
const tools = [
  {
    type: 'function',
    function: {
      name: 'updateLeadStatus',
      description: "This function is called when the user is not interested in the service anymore or when the user booked a call.",
      parameters: {
        type: 'object',
        properties: {
          user_email: {
            type: 'string',
            description: 'The email of the user',
          },
          status: {
            type: 'string',
            enum: ['Booked', 'Stopped'],
            description: 'The status of the lead. Booked means the user booked a call. Stopped means the user is not interested anymore.',
          }
        },
        required: ['user_email'],
      },
    },
  },
];

export const generateMessage = async (lead: Lead): Promise<string> => {
  try {
    const prompt = getPrompt(lead);
    let history = [{role: 'system', content: prompt}];
    lead.messages?.forEach(message => {
      history.push({role: 'assistant', content: message.assistant});
      history.push({role: 'user', content: message.lead});
    })
    console.log(history)
    // @ts-ignore
    let response = await client.chat.completions.create({
                                                            model: 'gpt-4o-mini',
                                                            messages: [...history],
                                                            // @ts-ignore
                                                            tools:  tools,
                                                          });

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall?.function.name === 'updateLeadStatus') {
      const args = JSON.parse(toolCall.function.arguments);
      console.log('Function arguments extracted:', args);
      const leadIndex = leads.findIndex(lead => lead.email === args.user_email);
        if (leadIndex !== -1) {
            leads[leadIndex].status = args.status;
            console.log(`Lead status updated to ${args.status}`);
        } else {
            console.error('Lead not found');
        }
      response = await client.chat.completions.create({
                                                        model: 'gpt-4o-mini',
                                                          // @ts-ignore
                                                        messages: [...history]
                                                      });
    }
    return response.choices[0].message.content || 'No response';

  } catch (error) {
    console.error("OpenAI error:", error);
    throw error
  }
};
