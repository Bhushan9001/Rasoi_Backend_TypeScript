import { PrismaClient } from "@prisma/client";
import { monitorEventLoopDelay } from "perf_hooks";

const prisma = new PrismaClient();

export default prisma;