import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const megillahRouter = createTRPCRouter({
  index: publicProcedure.query(({ ctx }) => {
    return ctx.db.megillah.findMany({
      orderBy: {
        issue: "desc",
      },
    });
  }),
});
