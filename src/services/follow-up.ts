import {Request, Response} from 'express';
import {generateMessage} from './openai';
import {isTimeToFollowUp} from '../utils/logic';
import {leads} from "../mocks/leads";
import {LeadStatus, Message} from "../types/lead";

export const checkLeads = async (req: Request, res: Response) => {
  for (let lead of leads) {
    if (lead.status === LeadStatus.NEW && isTimeToFollowUp(lead.first_contacted_date)) {
      let message = '';
      try {
        message = await generateMessage(lead);
      } catch {
        continue;
      }
      lead.messages = lead.messages || [];
      const newMessage: Message = {
        assistant: message,
        lead: '',
        sentTime: new Date().toISOString(),
        replyTime: '',
        reply_status: null
      };
      lead.messages.push(newMessage);
      lead.status = LeadStatus.CONTACTED;
      console.log(`Simulated email to ${lead.email}, with message: ${message}`);
    }
  }
  res.json({message: 'Follow-up check complete', leads});
};

export const replyToLead = async (req: Request, res: Response) => {
  const leadEmail = req.query.email as string;
  const reply = req.query.reply as string;
  if (!leadEmail || !reply) {
    return res.status(400).json({ message: 'Email and reply are required' });
  }

  const maxRetries = 3;
  const retryDelay = 2000;

  const leadIndex = leads.findIndex(lead => lead.email === leadEmail);
  if (leadIndex === -1) {
    return res.status(404).json({ message: 'Lead not found' });
  }

  const lead = leads[leadIndex];
  if (!lead.messages || lead.messages.length === 0) {
    return res.status(400).json({ message: 'No messages found for this lead' });
  }

  const lastMessageIndex = lead.messages.length - 1;
  lead.messages[lastMessageIndex] = {
    ...lead.messages[lastMessageIndex],
    lead: reply,
    replyTime: new Date().toISOString(),
    reply_status: 'received'
  };

  let attempts = 0;
  let success = false;

  while (!success && attempts < maxRetries) {
    try {
      let message = await generateMessage(lead);
      const newMessage: Message = {
        assistant: message,
        lead: '',
        sentTime: new Date().toISOString(),
        replyTime: '',
        reply_status: null
      };
      lead.messages.push(newMessage);
      success = true;
    } catch (error) {
      attempts++;
      if (attempts < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  leads[leadIndex] = lead;
  res.json({ message: success ? 'Reply recorded' : `Failed to generate response after ${attempts} attempts`, lead });
};

export const getLeads = (req: Request, res: Response) => {
  res.json({leads});
};
