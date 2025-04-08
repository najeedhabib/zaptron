import {Lead, LeadStatus} from "../types/lead";

export let leads: Lead[] = [
	{
		id: '1',
		email: 'alex@example.com',
		name: 'Alex',
		details: 'Ads management and SEO',
		status: LeadStatus.NEW,
		first_contacted_date: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
		messages: []
	},
	{
		id: '2',
		email: 'john@example.com',
		name: 'John',
		details: 'Website design and development',
		status: LeadStatus.NEW,
		first_contacted_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		messages: []
	},

];
