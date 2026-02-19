import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWorkspaceInviteEmail(
  to: string,
  inviteLink: string,
  workspaceName: string
) {
  await resend.emails.send({
    from: "Workspace Invite <onboarding@resend.dev>",
    to,
    subject: `You are invited to join ${workspaceName}`,
    html: `
      <div>
        <h2>You’re invited to join ${workspaceName}</h2>
        <p>Click the button below to accept the invite:</p>
        <a href="${inviteLink}"
           style="padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px">
           Accept Invite
        </a>
        <p>This invite expires in 7 days.</p>
      </div>
    `,
  });
}
