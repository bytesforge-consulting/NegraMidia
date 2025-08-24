export interface AppNotification{
	name: string,
	email: string,
	phone: string,
	body: string,
	subject: string
}

export interface NotificationResponse {
	success: boolean;
	data?: {
		id: number;
		name: string;
		email: string;
		phone: string;
		body: string;
		subject: string;
		sent_at: string;
		read_at: string | null;
	};
	error?: string;
}
