
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./ForumDetails.css";

type Forum = {
  id: string;
  name: string;
  description: string;
  study_year: string;
};

type ForumPost = {
  id: string;
  forum_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type ForumReply = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

function ForumDetails() {
  const { forumId } = useParams<{ forumId: string }>();

  const [forum, setForum] = useState<Forum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [postsError, setPostsError] = useState("");

  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  // Load the current authenticated user.
  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error) {
        console.error("USER ERROR:", error);
        setUser(null);
      } else {
        setUser(data.user);
      }
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load the selected community.
  useEffect(() => {
    let active = true;

    async function loadForum() {
      setLoading(true);
      setPageError("");
      setForum(null);

      if (!forumId) {
        setPageError("The community ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("forums")
          .select("*")
          .eq("id", forumId)
          .maybeSingle();

        if (error) throw error;

        if (active) {
          setForum(data as Forum | null);

          if (!data) {
            setPageError("We couldn't find this community.");
          }
        }
      } catch (error) {
        console.error("FORUM ERROR:", error);

        if (active) {
          setPageError(
            "We couldn't load this community. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadForum();

    return () => {
      active = false;
    };
  }, [forumId]);

  // Load posts and their replies.
  const loadPosts = useCallback(async () => {
    setPostsLoading(true);
    setPostsError("");

    if (!forumId) {
      setPosts([]);
      setReplies([]);
      setPostsLoading(false);
      return;
    }

    try {
      const { data: postData, error: postError } = await supabase
        .from("forum_posts")
        .select("*")
        .eq("forum_id", forumId)
        .order("created_at", { ascending: false });

      if (postError) throw postError;

      const loadedPosts = (postData ?? []) as ForumPost[];
      let loadedReplies: ForumReply[] = [];

      if (loadedPosts.length > 0) {
        const postIds = loadedPosts.map((post) => post.id);

        const { data: replyData, error: replyError } = await supabase
          .from("forum_post_replies")
          .select("*")
          .in("post_id", postIds)
          .order("created_at", { ascending: true });

        if (replyError) throw replyError;

        loadedReplies = (replyData ?? []) as ForumReply[];
      }

      setPosts(loadedPosts);
      setReplies(loadedReplies);
    } catch (error) {
      console.error("POSTS OR REPLIES ERROR:", error);
      setPostsError(
        "We couldn't load the conversations. Please try again."
      );
    } finally {
      setPostsLoading(false);
    }
  }, [forumId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  // Create a new discussion.
  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      alert("Please log in to join the conversation.");
      return;
    }

    if (!forumId) {
      alert("The community could not be identified.");
      return;
    }

    const content = newPost.trim();

    if (!content) return;

    if (content.length > 1000) {
      alert("Your discussion cannot exceed 1000 characters.");
      return;
    }

    setPosting(true);

    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .insert({
          forum_id: forumId,
          user_id: user.id,
          content,
        })
        .select("*")
        .single();

      if (error) throw error;

      setPosts((current) => [data as ForumPost, ...current]);
      setNewPost("");
    } catch (error) {
      console.error("POST CREATION ERROR:", error);
      alert(
        "Your discussion could not be created. Please check your connection and permissions."
      );
    } finally {
      setPosting(false);
    }
  }

  // Create a reply to a discussion.
  async function handleCreateReply(
    event: FormEvent<HTMLFormElement>,
    postId: string
  ) {
    event.preventDefault();

    if (!user) {
      alert("Please log in to reply.");
      return;
    }

    const content = replyText.trim();

    if (!content) return;

    if (content.length > 500) {
      alert("Your reply cannot exceed 500 characters.");
      return;
    }

    setReplying(true);

    try {
      const { data, error } = await supabase
        .from("forum_post_replies")
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select("*")
        .single();

      if (error) throw error;

      setReplies((current) => [...current, data as ForumReply]);
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("REPLY CREATION ERROR:", error);
      alert(
        "Your reply could not be sent. Please check your connection and permissions."
      );
    } finally {
      setReplying(false);
    }
  }

  function getPostReplies(postId: string) {
    return replies.filter((reply) => reply.post_id === postId);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Initial loading state.
  if (loading) {
    return (
      <main className="forum-community-page">
        <div className="forum-page-loading">
          Loading community...
        </div>
      </main>
    );
  }

  // Community not found or unable to load.
  if (!forum) {
    return (
      <main className="forum-community-page">
        <div className="forum-not-found">
          <h1>Community unavailable</h1>
          <p>
            {pageError || "We couldn't find this community."}
          </p>
          <Link to="/forums" className="forum-primary-link">
            Back to Communities
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="forum-community-page">
      {/* Community header */}
      <section className="community-header">
        <div className="community-header-inner">
          <Link to="/forums" className="community-back-link">
            ← Back to Communities
          </Link>

          <span className="community-label">
            QALA THUTO COMMUNITY
          </span>

          <h1>{forum.name}</h1>
          <p>{forum.description}</p>

          <div className="community-header-meta">
            <span>{forum.study_year}</span>
            <span>Student Community</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="community-content">
        <div className="community-layout">
          <div className="community-main">
            {/* Discussion composer */}
            {user ? (
              <section className="conversation-composer">
                <div className="composer-heading">
                  <span className="section-label">
                    SHARE WITH YOUR COMMUNITY
                  </span>

                  <h2>What's on your mind?</h2>

                  <p>
                    Ask a question, share an experience, or tell
                    other students about an opportunity.
                  </p>
                </div>

                <form onSubmit={handleCreatePost}>
                  <textarea
                    value={newPost}
                    onChange={(event) =>
                      setNewPost(event.target.value)
                    }
                    maxLength={1000}
                    required
                    placeholder="Start a conversation..."
                    className="conversation-textarea"
                  />

                  <div className="composer-footer">
                    <span className="character-count">
                      {newPost.length}/1000
                    </span>

                    <button
                      type="submit"
                      className="share-button"
                      disabled={posting || !newPost.trim()}
                    >
                      {posting ? "Sharing..." : "Share with Community"}
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <section className="login-community-card">
                <div>
                  <span className="section-label">
                    JOIN THE CONVERSATION
                  </span>

                  <h2>Have something to share?</h2>

                  <p>
                    Log in to ask questions, share experiences
                    and connect with other students.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="login-community-button"
                >
                  Log In
                </Link>
              </section>
            )}

            {/* Community conversations */}
            <section className="conversations-section">
              <div className="conversations-heading">
                <div>
                  <span className="section-label">
                    COMMUNITY CONVERSATIONS
                  </span>
                  <h2>What students are saying</h2>
                </div>

                <span className="conversation-count">
                  {posts.length}{" "}
                  {posts.length === 1
                    ? "conversation"
                    : "conversations"}
                </span>
              </div>

              {postsLoading ? (
                <div className="conversation-state">
                  Loading conversations...
                </div>
              ) : postsError ? (
                <div className="conversation-state" role="alert">
                  <p>{postsError}</p>
                  <button type="button" onClick={() => void loadPosts()}>
                    Try Again
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="conversation-empty">
                  <div className="empty-icon">+</div>

                  <h3>Be the first to start a conversation</h3>

                  <p>
                    Share a question, experience or opportunity
                    with your community.
                  </p>
                </div>
              ) : (
                <div className="conversations-list">
                  {posts.map((post) => {
                    const postReplies = getPostReplies(post.id);

                    return (
                      <article
                        className="conversation-card"
                        key={post.id}
                      >
                        {/* Post author */}
                        <div className="conversation-header">
                          <div className="member-avatar">QT</div>

                          <div className="member-details">
                            <strong>Qala Thuto Member</strong>
                            <span>
                              {formatDate(post.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Post content */}
                        <div className="conversation-content">
                          <p>{post.content}</p>
                        </div>

                        {/* Post actions */}
                        <div className="conversation-actions">
                          <span className="reply-count">
                            {postReplies.length}{" "}
                            {postReplies.length === 1
                              ? "reply"
                              : "replies"}
                          </span>

                          {user && (
                            <button
                              type="button"
                              className="conversation-reply-button"
                              onClick={() => {
                                if (replyingTo === post.id) {
                                  setReplyingTo(null);
                                  setReplyText("");
                                } else {
                                  setReplyingTo(post.id);
                                  setReplyText("");
                                }
                              }}
                            >
                              {replyingTo === post.id
                                ? "Cancel"
                                : "Join Conversation"}
                            </button>
                          )}
                        </div>

                        {/* Replies */}
                        {postReplies.length > 0 && (
                          <div className="conversation-replies">
                            {postReplies.map((reply) => (
                              <div
                                className="conversation-reply"
                                key={reply.id}
                              >
                                <div className="reply-member-avatar">
                                  QT
                                </div>

                                <div className="reply-content">
                                  <div className="reply-member-details">
                                    <strong>
                                      Qala Thuto Member
                                    </strong>

                                    <span>
                                      {formatDate(reply.created_at)}
                                    </span>
                                  </div>

                                  <p>{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {replyingTo === post.id && user && (
                          <form
                            className="conversation-reply-form"
                            onSubmit={(event) =>
                              void handleCreateReply(event, post.id)
                            }
                          >
                            <textarea
                              value={replyText}
                              onChange={(event) =>
                                setReplyText(event.target.value)
                              }
                              maxLength={500}
                              required
                              placeholder="Write your reply..."
                              className="reply-input"
                            />

                            <div className="reply-form-footer">
                              <span>{replyText.length}/500</span>

                              <button
                                type="submit"
                                disabled={
                                  replying || !replyText.trim()
                                }
                                className="reply-send-button"
                              >
                                {replying ? "Sending..." : "Send Reply"}
                              </button>
                            </div>
                          </form>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Community sidebar */}
          <aside className="community-sidebar">
            <div className="community-info-card">
              <span className="section-label">
                ABOUT THIS COMMUNITY
              </span>

              <h3>Connect with students</h3>

              <p>
                This is a space for students to exchange knowledge,
                experiences and opportunities.
              </p>

              <div className="community-guidelines">
                <div>
                  <strong>Ask questions</strong>
                  <span>Get advice from fellow students.</span>
                </div>

                <div>
                  <strong>Share experiences</strong>
                  <span>
                    Help others learn from your journey.
                  </span>
                </div>

                <div>
                  <strong>Discover opportunities</strong>
                  <span>
                    Share internships, learnerships and career
                    opportunities.
                  </span>
                </div>
              </div>
            </div>

            <div className="community-support-card">
              <span>QALA THUTO</span>
              <h3>Learn. Connect. Grow.</h3>
              <p>
                Your journey is better when you don't have to walk
                it alone.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default ForumDetails;