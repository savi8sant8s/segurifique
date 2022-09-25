import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function urlAllowed(url) {
    const allowed = await prisma.whitelistUrls.count({
        where: {
            url: {
                contains: url
            }
        }
    }) 
    return allowed > 0
}