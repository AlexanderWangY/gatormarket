import { auth } from '$lib/auth';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { categories } from '$lib/types/category';
import type { Condition } from '@prisma/client';
import { put } from '@vercel/blob';
import { prisma } from '$lib/server/prisma';

// This is needed so the server hooks can run for authenticated routes
export const load: PageServerLoad = async () => {
	return {};
};

export const actions = {
	createListing: async ({ request }) => {
		// Check if user is authenticated
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session || !session.user) {
			throw error(401);
		}

		const form = await request.formData();
		const photos = form.getAll('photos') as File[];
		const title = form.get('title') as string;
		const description = form.get('description') as string;
		const category = categories[form.get('category') as string];
		const price = form.get('price') as unknown as number;
		const condition = form.get('condition') as Condition;

		console.log('photos', photos);
		console.log('title', title);
		console.log('description', description);
		console.log('category', category);
		console.log('price', price);
		console.log('condition', condition);

		const urls: string[] = [];

		// Upload photos to vercel blob

		for (const photo of photos) {
			if (!photo || !photo.type.startsWith('image/')) {
				throw error(400);
			}

			const { url } = await put(photo.name, photo, { access: 'public' });
			urls.push(url);
		}

		const listing = await prisma.listing.create({
			data: {
				title,
				description,
				category,
				price,
				condition,
				images: urls,
				userId: session.user.id,
				status: 'ACTIVE'
			}
		});

		if (!listing) {
			throw error(500);
		}

		return {
			success: true,
			listingId: listing.id
		};
	}
} satisfies Actions;
