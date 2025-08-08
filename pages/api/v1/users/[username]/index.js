import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.get(async (request, response) => {
  const userFound = await user.findOneByUsername(request.query.username);

  return response.status(200).json(userFound);
});
