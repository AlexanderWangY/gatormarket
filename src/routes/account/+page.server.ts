import { auth } from '$lib/auth';
import { prisma } from '$lib/server/prisma';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// This is needed so the server hooks can run for authenticated routes
export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		throw error(401);
	}

	return {
		user: await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { name: true, email: true, image: true, id: true }
		})
	};
};

export const actions = {
	editName: async ({ request }) => {
		// Check if user is authenticated
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session || !session.user) {
			throw error(401);
		}

		const data = await request.formData();
		const name = data.get('name') as string;

		await prisma.user.update({
			where: { id: session.user.id },
			data: { name }
		});

		return {
			success: true
		};
	},

	updateAvatar: async ({ request }) => {
		const formData = await request.formData();
		const file = formData.get('avatar') as File;

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session || !session.user) {
			throw error(401);
		}

		if (!file || !file.type.startsWith('image/')) {
			throw error(400);
		}

		console.log('File:', file);

		// Store in bucket here

		return { success: true };
	}
} satisfies Actions;
