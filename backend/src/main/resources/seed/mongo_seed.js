// Seed data for MongoDB documents in TalkTalk
// Covers: attachments, messages
// Safe to rerun: it removes only previously created seed documents.

const now = new Date();
const statusList = ['SENT', 'DELIVERED', 'SEEN'];

const attachments = Array.from({ length: 50 }, (_, index) => {
  const n = index + 1;
  return {
    url: `https://cdn.talk.local/files/seed-file-${String(n).padStart(2, '0')}.jpg`,
    fileName: `seed_file_${String(n).padStart(2, '0')}.jpg`,
    contentType: n % 5 === 0 ? 'video/mp4' : 'image/jpeg',
    size: 1024 * (n + 10),
    thumbnail: `https://cdn.talk.local/thumbs/seed-file-${String(n).padStart(2, '0')}.jpg`,
    createdAt: new Date(now.getTime() - n * 86400000),
    updatedAt: new Date(now.getTime() - n * 3600000)
  };
});

db.attachments.deleteMany({ fileName: /^seed_file_/ });
db.attachments.insertMany(attachments);

const messages = Array.from({ length: 50 }, (_, index) => {
  const n = index + 1;
  const primaryAttachment = attachments[index];
  const secondaryAttachment = attachments[(index + 1) % attachments.length];

  let embeddedAttachments = [];
  if (n % 10 === 0) {
    embeddedAttachments = [primaryAttachment, secondaryAttachment];
  } else if (n % 4 === 0) {
    embeddedAttachments = [primaryAttachment];
  }

  return {
    conversationId: String(((n - 1) % 50) + 1),
    senderId: String(((n + 7) % 50) + 1),
    content: `Seed message ${String(n).padStart(2, '0')} for local development`,
    status: statusList[index % statusList.length],
    editedAt: n % 6 === 0 ? new Date(now.getTime() - n * 1800000) : null,
    deletedAt: null,
    attachments: embeddedAttachments,
    createdAt: new Date(now.getTime() - n * 7200000),
    updatedAt: new Date(now.getTime() - n * 3600000)
  };
});

db.messages.deleteMany({ content: /^Seed message / });
db.messages.insertMany(messages);

print(`Inserted ${attachments.length} attachments and ${messages.length} messages.`);
