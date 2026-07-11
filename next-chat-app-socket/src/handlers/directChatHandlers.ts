import "dotenv/config";
import { Server, Socket } from "socket.io";
import { prisma } from "../db/index";
import { messageSchema } from "../validations/messageSchema";
import { activeChatsType, SocketMap } from "../server";
interface SendMessagePayload {
  contactId: string;
  senderId: string;
  content: string | null;
  images: string[];
}

interface DeleteMessagePayload {
  contactId: string;
  messageId: string;
}

interface EditMessagePayload {
  contactId: string;
  messageId: string;
  content: string;
}
export default function directChatHandlers(
  io: Server,
  socket: Socket,
  socketToUser: SocketMap,
  activeChats: activeChatsType
) {
  socket.on("join_dm", async (contactId?: string) => {
    if (!contactId) return;
    const userId = socketToUser.get(socket.id);
    if (!userId) return;
    let chats = activeChats.get(userId);

    if (!chats) {
      chats = new Set();
      activeChats.set(userId, chats);
    }

    chats.add(contactId);
    await prisma.message.updateMany({
      where: {
        contactId: contactId,
        isSeen: false,
        senderId: {
          not: userId,
        },
      },
      data: {
        isSeen: true,
      },
    });

    socket.join(contactId);
  });
  socket.on(
    "send_dm",
    async (payload: SendMessagePayload, callback?: (response: any) => void) => {
      try {
        const { contactId, senderId, content, images } = payload;
        const parsed = messageSchema.safeParse({
          content,
        });

        if (!parsed.success && images.length === 0) {
          return callback?.({
            success: false,
            message: parsed.error.flatten().formErrors,
          });
        }

        const contact = await prisma.contact.findUnique({
          where: {
            id: contactId,
          },
        });

        if (!contact) {
          return callback?.({
            success: false,
            message: "Conversation not found.",
          });
        }

        if (contact.user1Id !== senderId && contact.user2Id !== senderId) {
          return callback?.({
            success: false,
            message: "Forbidden.",
          });
        }

        if (contact.blockedById) {
          return callback?.({
            success: false,
            message: "Conversation is blocked.",
          });
        }
        const receiverId =
          contact.user1Id === senderId ? contact.user2Id : contact.user1Id;
        const receiverOpenedChats = activeChats.get(receiverId);
        const message = await prisma.message.create({
          data: {
            contactId,
            senderId,
            content: parsed.data?.content,
            images,
            isSeen: receiverOpenedChats?.has(contactId),
          },
          include: {
            sender: {
              select: {
                id: true,
                fullname: true,
                username: true,
                image: true,
              },
            },
          },
        });
        io.to(`user:${receiverId}`).emit("receive_dm", message, contact.id);
        io.to(`user:${senderId}`).emit("receive_dm", message, contact.id);
        callback?.({
          success: true,
          data: message,
        });
      } catch (error) {
        console.error(error);

        callback?.({
          success: false,
          message: "Internal server error.",
        });
      }
    }
  );
  socket.on(
    "delete_dm",
    async (
      payload: DeleteMessagePayload,
      callback?: (response: any) => void
    ) => {
      try {
        const { contactId, messageId } = payload;
        await prisma.contact.update({
          where: {
            id: contactId,
            messages: {
              some: {
                id: messageId,
              },
            },
          },
          data: {
            messages: {
              update: {
                where: {
                  id: messageId,
                },
                data: {
                  content: "",
                  isDeleted: true,
                },
              },
            },
          },
        });
        io.to(contactId).emit("message_deleted", messageId, contactId);
      } catch (error: any) {
        callback?.({
          success: false,
          message: error.message || "Internal server error.",
        });
      }
    }
  );
  socket.on(
    "edit_dm",
    async (payload: EditMessagePayload, callback?: (response: any) => void) => {
      try {
        const { contactId, content, messageId } = payload;
        await prisma.contact.update({
          where: {
            id: contactId,
            messages: {
              some: {
                id: messageId,
              },
            },
          },
          data: {
            messages: {
              update: {
                where: {
                  id: messageId,
                },
                data: {
                  content: content,
                },
              },
            },
          },
        });
        callback?.({
          success: true,
          message: "Edited Message Successfully!",
        });
        io.to(contactId).emit("message_edited", messageId, content, contactId);
      } catch (error: any) {
        callback?.({
          success: false,
          message: error.message || "Failed To Edit Message",
        });
      }
    }
  );
  socket.on("leave_dm", async (contactId: string) => {
    if (!contactId) return;
    const userId = socketToUser.get(socket.id);
    if (!userId) return;
    let chats = activeChats.get(userId);
    if (chats) {
      chats.delete(contactId);

      // Remove the user entry if no active chats remain
      if (chats.size === 0) {
        activeChats.delete(userId);
      }
    }

    socket.leave(contactId);
  });
  socket.on(
    "block_user",
    async (blockerId: string, blockedId: string, contactId: string) => {
      const QRY = {
        id: contactId,
        OR: [
          {
            user1Id: blockerId,
            user2Id: blockedId,
          },
          {
            user1Id: blockedId,
            user2Id: blockerId,
          },
        ],
      };
      const contact = await prisma.contact.findFirst({
        where: QRY,
      });
      if (!contact) return;

      const date = new Date();
      await prisma.contact.update({
        where: {
          id: contact.id,
        },
        data: {
          blockedById: blockerId,
          blockedAt: date,
        },
      });
      io.to(`user:${blockerId}`).emit(
        "blocked_user",
        contact.id,
        blockerId,
        date
      );
      io.to(`user:${blockedId}`).emit(
        "blocked_user",
       contact.id,
        blockerId,
        date 
      );
    }
  );

  socket.on("unblock_user", async (contactId: string) => {
    const contact = await prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        blockedById: null,
        blockedAt: null,
      },
    });
    if (!contact) return;
    io.to(`user:${contact.user1Id}`).emit("unblocked_user", contact.id);
    io.to(`user:${contact.user2Id}`).emit("unblocked_user", contact.id);
  });
}
