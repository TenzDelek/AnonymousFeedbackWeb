import { Resend } from 'resend';
//all are looked from docs
export const resend = new Resend(process.env.RESEND_API_KEY);