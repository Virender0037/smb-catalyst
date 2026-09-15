import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Badge, Button, Icon } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import { usePortalState } from '../lib/portalState';
import { useIsMobile } from '../lib/hooks';

function Attachment({ file }) {
  return (
    <div className="bubble-attach">
      <span className={`file-icon file-${file.type}`} aria-hidden="true">
        {file.type}
      </span>
      <span style={{ minWidth: 0 }}>
        <span className="bubble-attach-name truncate" style={{ display: 'block' }}>
          {file.name}
        </span>
        <span className="bubble-attach-size">{file.size}</span>
      </span>
      <button type="button" className="btn btn-icon" aria-label={`Download ${file.name}`} style={{ color: 'inherit' }}>
        <Icon name="download" size={16} />
      </button>
    </div>
  );
}

export default function Messages() {
  const isMobile = useIsMobile();
  const { notify } = useToast();

  const { conversations, setConversations } = usePortalState();
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [view, setView] = useState('list'); // mobile only
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);

  // Keep the newest message in sight whenever the thread changes.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, active?.messages.length]);

  // Leaving mobile width must never leave the user on a hidden pane.
  useEffect(() => {
    if (!isMobile) setView('list');
  }, [isMobile]);

  const openConversation = (id) => {
    setActiveId(id);
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    if (isMobile) setView('thread');
  };

  const send = (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              preview: body,
              lastActivity: 'Just now',
              messages: [...c.messages, { id: `m-${c.messages.length + 1}`, from: 'me', day: 'Today', time: 'Just now', body }],
            }
          : c,
      ),
    );
    setDraft('');
    notify('Message sent to your advisory team.');
  };

  const days = [];
  active?.messages.forEach((m) => {
    const last = days[days.length - 1];
    if (last && last.day === m.day) last.items.push(m);
    else days.push({ day: m.day, items: [m] });
  });

  return (
    <div className="msg-page">
      <div className="page-head" style={{ marginBottom: 0, flex: 'none' }}>
        <div>
          <h2>Messages</h2>
          <p className="page-head-sub">Secure, logged correspondence with the professionals on your engagement.</p>
        </div>
      </div>

      <div className="msg-wrap" data-view={view}>
        {/* ---- conversation list ---- */}
        <div className="msg-list-pane">
          <div className="msg-list-head">
            <div className="input-wrap">
              <span className="input-affix input-affix-l">
                <Icon name="search" size={16} />
              </span>
              <input className="input" type="search" placeholder="Search messages" aria-label="Search messages" />
            </div>
          </div>
          <div className="msg-list" role="list">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                role="listitem"
                className={`msg-list-item ${c.id === activeId && !isMobile ? 'is-active' : ''}`}
                onClick={() => openConversation(c.id)}
                aria-current={c.id === activeId ? 'true' : undefined}
              >
                <Avatar name={c.name} initials={c.initials} tone={c.unread ? 'accent' : ''} />
                <div className="msg-list-body">
                  <div className="msg-list-top">
                    <span className="msg-list-name truncate">{c.name}</span>
                    <span className="msg-list-time">{c.lastActivity}</span>
                  </div>
                  <div className="msg-list-role truncate">{c.role}</div>
                  <p className="msg-list-preview">{c.preview}</p>
                </div>
                {c.unread > 0 && <span className="msg-unread-dot" aria-label={`${c.unread} unread`} />}
              </button>
            ))}
          </div>
        </div>

        {/* ---- thread ---- */}
        <div className="msg-thread-pane">
          <div className="msg-thread-head">
            {isMobile && (
              <button type="button" className="btn btn-icon" onClick={() => setView('list')} aria-label="Back to conversations">
                <Icon name="chevronLeft" size={20} />
              </button>
            )}
            <Avatar name={active.name} initials={active.initials} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="msg-list-name truncate">{active.name}</p>
              <p className="msg-list-role truncate">{active.role} · Strategic Medical Brokers</p>
            </div>
            <Badge tone="success" dot className="msg-status">
              Online
            </Badge>
          </div>

          <div className="msg-thread" ref={threadRef}>
            {days.map((group) => (
              <div key={group.day} className="stack stack-4">
                <span className="msg-day">{group.day}</span>
                {group.items.map((m) => (
                  <div className={`bubble-row ${m.from === 'me' ? 'bubble-row-me' : ''}`} key={m.id}>
                    {m.from !== 'me' && <Avatar name={active.name} initials={active.initials} size="sm" />}
                    <div style={{ minWidth: 0 }}>
                      <div className={`bubble ${m.from === 'me' ? 'bubble-me' : ''}`}>
                        {m.body}
                        {m.attachment && <Attachment file={m.attachment} />}
                      </div>
                      <p className="bubble-time">
                        {m.from === 'me' ? 'You' : active.name.split(' ')[0]} · {m.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <form className="composer" onSubmit={send}>
            <div className="composer-box">
              <button type="button" className="btn btn-icon" aria-label="Attach a file">
                <Icon name="paperclip" size={19} />
              </button>
              <label className="sr-only" htmlFor="composer-input">
                Write a message to {active.name}
              </label>
              <textarea
                id="composer-input"
                className="textarea"
                rows={1}
                placeholder={`Message ${active.name.split(' ')[0]}…`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) send(e);
                }}
              />
              <Button type="submit" variant="primary" icon="send" disabled={!draft.trim()} aria-label="Send message">
                Send
              </Button>
            </div>
            <p className="composer-hint">
              Press Enter to send, Shift + Enter for a new line. Messages are encrypted and retained with your engagement
              record.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
