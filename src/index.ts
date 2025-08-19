import Fastify from "fastify";

const port = process.env.PORT ?? 3333;

const fastify = Fastify({
  // logger: true
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

// Run the server!
fastify.listen({ port: Number(port) }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at: ${address}`);
});
