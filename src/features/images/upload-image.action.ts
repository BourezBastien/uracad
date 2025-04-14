"use server";

import { ActionError, serverAction } from "@/lib/actions/safe-actions";
import { utapi } from "@/lib/utapi";
import { z } from "zod";

export const uploadImageAction = serverAction
  .schema(
    z.object({
      formData: z.instanceof(FormData),
    }),
  )
  .action(async ({ parsedInput: { formData } }) => {
    const files = formData.get("files") as File | File[];

    let file: File;

    if (Array.isArray(files)) {
      file = files[0];
    } else {
      file = files;
    }

    if (!(file instanceof File)) {
      throw new ActionError("Invalid file (not a file)");
    }

    // If file is not an image throw an error
    if (!file.type.startsWith("image/")) {
      throw new ActionError("Invalid file (only images are allowed)");
    }

    // If file is too large throw an error (max 2mb)
    if (file.size > 2 * 1024 * 1024) {
      throw new ActionError("File too large (max 2mb)");
    }

    const response = await utapi.uploadFiles([file]);

    if (response[0].error) {
      throw new ActionError(response[0].error.message);
    }

    // const image = await prisma.image.create({
    //   data: {
    //     url: response[0].data.url,
    //     name: response[0].data.name,
    //     serverId: ctx.server.id,
    //   },
    // });

    return response[0].data.url;
  });
