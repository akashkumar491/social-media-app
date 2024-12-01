"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../authContext/authContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/navigation";

const Feed = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const { user, isAuthenticated, login } = useAuth();
  const username = user?.name;
  const userId = user?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/post/posts");
      const data = await res.json();
      setPosts(
        data.map((post) => ({
          ...post,
          liked: likedPosts.includes(post.id),
        }))
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/like/liked_posts?userId=${userId}`
        );
        const data = await res.json();
        setLikedPosts(data.map((post) => post.post_id));
      } catch (error) {
        console.error("Error fetching liked posts:", error);
      }
    };

    const fetchUserFollowers = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/follow/followers?userId=${userId}`
        );
        const data = await res.json();
        setFollowers(data.map((followed) => followed.followed_id));
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    fetchUserFollowers();
    fetchLikedPosts();
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [likedPosts]);

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/post/create_post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, username, content: newPost }),
      });

      if (res.ok) {
        const newPostData = await res.json();
        console.log(newPostData, "41414");
        setPosts([newPostData, ...posts]);
        setNewPost("");
      } else {
        console.error("Error posting:", await res.text());
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      const res = await fetch("http://localhost:5000/api/like/toggle_like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, liked: !post.liked } : post
          )
        );
      } else {
        console.error("Error toggling like/unlike:", await res.text());
      }
    } catch (error) {
      console.error("Error toggling like/unlike:", error);
    }
  };

  const handleFollowClick = async (followedId) => {
    try {
      const res = await fetch("http://localhost:5000/api/follow/follow_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followedId: followedId, followerId: userId }),
      });

      if (res.ok) {
        console.log("Follow request sent successfully");
        setFollowers((prevFollowers) => [...prevFollowers, followedId]);
      } else {
        console.error("Error sending follow request:", await res.text());
      }
    } catch (error) {
      console.error("Error sending follow request:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div style={styles.feedContainer}>
      {/* App Bar */}
      <header style={styles.header}>
        <h2>Welcome, {username}!</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {/* Post Input */}
      <div style={styles.newPostSection}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows="3"
          style={styles.textarea}
        ></textarea>
        <br />
        <button onClick={handlePostSubmit} style={styles.postButton}>
          Post
        </button>
      </div>

      {/* Posts Feed */}
      <div style={styles.postsFeed}>
        {posts.map((post) => (
          <div key={post.id} style={styles.post}>
            <div style={styles.postHeader}>
              {/* Avatar and User Info */}
              <div style={styles.userInfo}>
                <BsPersonCircle size={40} style={styles.avatar} />
                <div>
                  <strong>{post.username}</strong>
                  {userId !== post.user_id &&
                  !followers.includes(post.user_id) ? (
                    <button
                      onClick={() => handleFollowClick(post.user_id)}
                      style={styles.followButton}
                    >
                      Follow
                    </button>
                  ) : null}
                  {followers.includes(post.user_id) ? (
                    <button
                      disabled
                      style={{
                        ...styles.followButton,
                        backgroundColor: "gray",
                      }}
                    >
                      Following
                    </button>
                  ) : null}
                </div>
              </div>
              <p style={styles.postContent}>{post.content}</p>
              <small style={styles.postDate}>
                {new Date(post.created_at).toLocaleString()}
              </small>
            </div>
            {/* Like Button */}
            <button
              onClick={() => handleLikeToggle(post.id)}
              style={styles.likeButton}
            >
              {post.liked ? (
                <FaHeart size={20} style={{ color: "red" }} />
              ) : (
                <FaRegHeart size={20} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  feedContainer: {
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    backgroundColor: "#6200ea",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  newPostSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  textarea: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  postButton: {
    backgroundColor: "#6200ea",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  postsFeed: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  post: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
  },
  postHeader: {
    display: "flex",
    flexDirection: "column",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    color: "#6200ea",
  },
  followButton: {
    backgroundColor: "#6200ea",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "5px",
    marginLeft: "50px",
  },
  postContent: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#333",
  },
  postDate: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#888",
  },
  likeButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
  logoutButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "20px",
    position: "absolute",
    top: "35px",
    right: "25px",
  },
};

export default Feed;
