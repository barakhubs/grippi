import React from "react";
import type { AppConfig } from "../../types";

interface PlatformPreviewProps {
  channelName: string;
  text: string;
  imageSrc: string;
  mediaType?: string;
  mode: "mobile" | "desktop";
  appConfig: AppConfig;
}

// const getImageSrc = (src: string) => {
//   return (
//     src ||
//     'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E'
//   );
// };

export const PlatformPreview: React.FC<PlatformPreviewProps> = ({
  channelName,
  text,
  imageSrc,
  mediaType,
  mode,
  appConfig,
}) => {
  const isVideo = mediaType?.toLowerCase() === "video";

  const renderMedia = (className: string, style?: React.CSSProperties) => {
    // Don't render anything if no image source is provided
    if (!imageSrc) {
      return null;
    }

    if (isVideo) {
      return (
        <video
          src={imageSrc}
          className={className}
          style={style}
          controls
          autoPlay
          muted
          loop
          playsInline
        />
      );
    }
    return (
      <img
        src={imageSrc}
        alt="Post visual"
        className={className}
        style={style}
      />
    );
  };

  const renderMobileFacebook = () => (
    <div className="ucpe_platform-post ucpe_fb-post">
      <div className="ucpe_fb-post-header">
        <div className="ucpe_fb-avatar">
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            appConfig.companyName.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="ucpe_fb-user-info">
          <h4>{appConfig.socialAccounts.facebook || appConfig.companyName}</h4>
          <p className="ucpe_fb-timestamp">
            Just now · <i className="fa-solid fa-globe"></i>
          </p>
        </div>
        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            marginLeft: "auto",
            pointerEvents: "none",
          }}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      <div
        className="ucpe_fb-post-text"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
      />
      {renderMedia("ucpe_fb-post-image")}
      <div className="ucpe_fb-post-actions">
        <div className="ucpe_fb-action">
          <i className="fa-regular fa-thumbs-up"></i> Like
        </div>
        <div className="ucpe_fb-action">
          <i className="fa-regular fa-comment"></i> Comment
        </div>
        <div className="ucpe_fb-action">
          <i className="fa-solid fa-share"></i> Share
        </div>
      </div>
    </div>
  );

  const renderMobileInstagram = () => (
    <div className="ucpe_platform-post ucpe_ig-post">
      <div className="ucpe_ig-post-header">
        <div className="ucpe_ig-avatar">
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            appConfig.companyName.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="ucpe_ig-username">
          {appConfig.socialAccounts.instagram ||
            appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
        </div>
        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      {renderMedia("ucpe_ig-post-image")}
      <div className="ucpe_ig-post-actions">
        <i className="fa-regular fa-heart"></i>
        <i className="fa-regular fa-comment"></i>
        <i className="fa-regular fa-paper-plane"></i>
        <span style={{ marginLeft: "auto", marginTop: "-10px" }}>
          <i className="fa-regular fa-bookmark"></i>
        </span>
      </div>
      <div className="ucpe_ig-post-caption">
        <span className="ucpe_ig-username-caption">
          {appConfig.socialAccounts.instagram ||
            appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
        </span>
        <span
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
        />
      </div>
    </div>
  );

  const renderMobileX = () => (
    <div className="ucpe_platform-post ucpe_twitter-post">
      <div className="ucpe_twitter-post-header">
        <div className="ucpe_twitter-avatar">
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            appConfig.companyName.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="ucpe_twitter-user-info">
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
              {appConfig.socialAccounts.x || appConfig.companyName}
            </h4>
            <i
              className="fa-solid fa-circle-check"
              style={{ color: "#1d9bf0" }}
            ></i>
          </div>
          <p style={{ margin: 0, fontSize: "14px", color: "#536471" }}>
            @
            {appConfig.socialAccounts.x ||
              appConfig.companyName.toLowerCase().replace(/\s+/g, "")}{" "}
            · Just now
          </p>
        </div>
      </div>
      <div
        className="ucpe_twitter-post-text"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
      />
      {renderMedia("ucpe_twitter-post-image")}
      <div className="ucpe_twitter-post-actions">
        <div className="ucpe_twitter-action">
          <i className="fa-regular fa-comment" style={{ color: "#536471" }}></i>
          <span>Reply</span>
        </div>
        <div className="ucpe_twitter-action">
          <i className="fa-solid fa-retweet" style={{ color: "#536471" }}></i>
          <span>Repost</span>
        </div>
        <div className="ucpe_twitter-action">
          <i className="fa-regular fa-heart" style={{ color: "#536471" }}></i>
          <span>Like</span>
        </div>
        <div className="ucpe_twitter-action">
          <i
            className="fa-solid fa-arrow-up-from-bracket"
            style={{ color: "#536471" }}
          ></i>
          <span>Share</span>
        </div>
      </div>
    </div>
  );

  const renderMobileTikTok = () => (
    <div className="ucpe_platform-post ucpe_tiktok-post">
      {renderMedia("ucpe_tiktok-bg")}
      <div className="ucpe_tiktok-content">
        <div className="ucpe_tiktok-user">
          @
          {appConfig.socialAccounts.tiktok ||
            appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
        </div>
        <div
          className="ucpe_tiktok-text"
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
        />
      </div>
    </div>
  );

  const renderMobileSnapchat = () => (
    <div className="ucpe_platform-post ucpe_snap-post">
      {renderMedia("ucpe_snap-image")}
      <div className="ucpe_snap-text-overlay">{text.split("\n")[0]}</div>
    </div>
  );

  const renderMobileContent = () => {
    switch (channelName.toLowerCase()) {
      case "facebook":
        return renderMobileFacebook();
      case "instagram":
        return renderMobileInstagram();
      case "x":
        return renderMobileX();
      case "tiktok":
        return renderMobileTikTok();
      case "snapchat":
        return renderMobileSnapchat();
      default:
        return <div style={{ padding: "20px" }}>{text}</div>;
    }
  };

  const renderDesktopFacebook = () => (
    <div
      className="ucpe_platform-post ucpe_fb-post"
      style={{ padding: "20px 0" }}
    >
      <div className="ucpe_fb-post-header">
        <div
          className="ucpe_fb-avatar"
          style={{ width: "40px", height: "40px" }}
        >
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            appConfig.companyName.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="ucpe_fb-user-info">
          <h4>{appConfig.socialAccounts.facebook || appConfig.companyName}</h4>
          <p className="ucpe_fb-timestamp">
            Just now · <i className="fa-solid fa-globe"></i>
          </p>
        </div>
        <button
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      <div
        className="ucpe_fb-post-text"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
      />
      {renderMedia("ucpe_fb-post-image", { maxHeight: "600px" })}
      <div className="ucpe_fb-post-actions">
        <div className="ucpe_fb-action">
          <i className="fa-regular fa-thumbs-up"></i> Like
        </div>
        <div className="ucpe_fb-action">
          <i className="fa-regular fa-comment"></i> Comment
        </div>
        <div className="ucpe_fb-action">
          <i className="fa-solid fa-share"></i> Share
        </div>
      </div>
    </div>
  );

  const renderDesktopInstagram = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 0",
        background: "#fafafa",
      }}
    >
      <div
        className="ucpe_platform-post ucpe_ig-post"
        style={{ maxWidth: "614px" }}
      >
        <div className="ucpe_ig-post-header">
          <div className="ucpe_ig-avatar">
            {appConfig.logo ? (
              <img
                src={appConfig.logo}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              appConfig.companyName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="ucpe_ig-username">
            {appConfig.socialAccounts.instagram ||
              appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
          </div>
          <button
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        {renderMedia("ucpe_ig-post-image")}
        <div className="ucpe_ig-post-actions">
          <i className="fa-regular fa-heart"></i>
          <i className="fa-regular fa-comment"></i>
          <i className="fa-regular fa-paper-plane"></i>
          <span style={{ marginLeft: "auto" }}>
            <i className="fa-regular fa-bookmark"></i>
          </span>
        </div>
        <div className="ucpe_ig-post-caption">
          <span className="ucpe_ig-username-caption">
            {appConfig.socialAccounts.instagram ||
              appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
          </span>
          <span
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
          />
        </div>
      </div>
    </div>
  );

  const renderDesktopX = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
        background: "#fff",
      }}
    >
      <div
        className="ucpe_platform-post ucpe_twitter-post"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="ucpe_twitter-post-header">
          <div
            className="ucpe_twitter-avatar"
            style={{ width: "48px", height: "48px" }}
          >
            {appConfig.logo ? (
              <img
                src={appConfig.logo}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              appConfig.companyName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="ucpe_twitter-user-info">
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>
                {appConfig.socialAccounts.x || appConfig.companyName}
              </h4>
              <i
                className="fa-solid fa-circle-check"
                style={{ color: "#1d9bf0" }}
              ></i>
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#536471" }}>
              @
              {appConfig.socialAccounts.x ||
                appConfig.companyName.toLowerCase().replace(/\s+/g, "")}{" "}
              · Just now
            </p>
          </div>
        </div>
        <div
          className="ucpe_twitter-post-text"
          dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
        />
        {renderMedia("ucpe_twitter-post-image")}
        <div className="ucpe_twitter-post-actions">
          <div className="ucpe_twitter-action">
            <i
              className="fa-regular fa-comment"
              style={{ color: "#536471" }}
            ></i>
            <span>Reply</span>
          </div>
          <div className="ucpe_twitter-action">
            <i className="fa-solid fa-retweet" style={{ color: "#536471" }}></i>
            <span>Repost</span>
          </div>
          <div className="ucpe_twitter-action">
            <i className="fa-regular fa-heart" style={{ color: "#536471" }}></i>
            <span>Like</span>
          </div>
          <div className="ucpe_twitter-action">
            <i
              className="fa-solid fa-arrow-up-from-bracket"
              style={{ color: "#536471" }}
            ></i>
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopTikTok = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
        background: "#000",
      }}
    >
      <div
        className="ucpe_platform-post ucpe_tiktok-post"
        style={{ maxWidth: "500px" }}
      >
        {renderMedia("ucpe_tiktok-bg")}
        <div className="ucpe_tiktok-content">
          <div className="ucpe_tiktok-user">
            @
            {appConfig.socialAccounts.tiktok ||
              appConfig.companyName.toLowerCase().replace(/\s+/g, "")}
          </div>
          <div
            className="ucpe_tiktok-text"
            dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
          />
        </div>
      </div>
    </div>
  );

  const renderDesktopSnapchat = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
        background: "#000",
      }}
    >
      <div
        className="ucpe_platform-post ucpe_snap-post"
        style={{ maxWidth: "400px" }}
      >
        {renderMedia("ucpe_snap-image")}
        <div className="ucpe_snap-text-overlay">{text.split("\n")[0]}</div>
      </div>
    </div>
  );

  const renderDesktopContent = () => {
    switch (channelName.toLowerCase()) {
      case "facebook":
        return renderDesktopFacebook();
      case "instagram":
        return renderDesktopInstagram();
      case "x":
        return renderDesktopX();
      case "tiktok":
        return renderDesktopTikTok();
      case "snapchat":
        return renderDesktopSnapchat();
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>{text}</div>
        );
    }
  };

  if (mode === "mobile") {
    return (
      <div className="ucpe_phone-frame">
        <div className="ucpe_phone-notch"></div>
        <div className="ucpe_phone-screen">
          <div className="ucpe_phone-statusbar">
            <span>9:41</span>
            <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <i className="fa-solid fa-battery-full"></i>
              <i className="fa-solid fa-wifi"></i>
            </span>
          </div>
          <div className="ucpe_phone-content">{renderMobileContent()}</div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="ucpe_desktop-frame">
      <div className="ucpe_browser-chrome">
        <div className="ucpe_browser-dots">
          <div className="ucpe_browser-dot ucpe_dot-red"></div>
          <div className="ucpe_browser-dot ucpe_dot-yellow"></div>
          <div className="ucpe_browser-dot ucpe_dot-green"></div>
        </div>
        <div className="ucpe_browser-addressbar">
          {channelName.toLowerCase() === "facebook"
            ? "facebook.com"
            : channelName.toLowerCase() === "instagram"
              ? "instagram.com"
              : channelName.toLowerCase() === "x"
                ? "x.com"
                : channelName.toLowerCase() === "tiktok"
                  ? "tiktok.com"
                  : channelName.toLowerCase() === "snapchat"
                    ? "snapchat.com"
                    : `${channelName.toLowerCase()}.com`}
        </div>
      </div>
      <div className="ucpe_browser-content">{renderDesktopContent()}</div>
    </div>
  );
};
