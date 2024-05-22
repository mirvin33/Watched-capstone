package com.nashss.se.watched.models;


import java.util.Objects;

public class ContentModel {
    private final String contentId;
    private final String watchlistId;
    private final String title;
    private final String userId;
    private final String streamService;
    private final Boolean watched;

    public ContentModel(String contentId, String watchlistId, String title, String userId, String streamService,
                        Boolean watched) {
        this.contentId = contentId;
        this.watchlistId = watchlistId;
        this.title = title;
        this.userId = userId;
        this.streamService = streamService;
        this.watched = watched;
    }

    public String getContentId() {
        return contentId;
    }

    public String getWatchlistId() {
        return watchlistId;
    }

    public String getTitle() {
        return title;
    }

    public String getUserId() {
        return userId;
    }

    public String getStreamService() {
        return streamService;
    }

    public Boolean getWatched() {
        return watched;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContentModel that = (ContentModel) o;
        return Objects.equals(contentId, that.contentId) &&
                Objects.equals(watchlistId, that.watchlistId) && Objects.equals(title, that.title) &&
                Objects.equals(userId, that.userId) && Objects.equals(streamService, that.streamService) &&
                Objects.equals(watched, that.watched);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contentId, watchlistId, title, userId, streamService, watched);
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String contentId;
        private String watchlistId;
        private String title;
        private String userId;
        private String streamService;
        private Boolean watched;

        public Builder withContentId(String contentId) {
            this.contentId = contentId;
            return this;
        }

        public Builder withWatchlistId(String watchlistId) {
            this.watchlistId = watchlistId;
            return this;
        }

        public Builder withTitle(String title) {
            this.title = title;
            return this;
        }

        public Builder withUserId(String userId) {
            this.userId = userId;
            return this;
        }

        public Builder withStreamService(String streamService) {
            this.streamService = streamService;
            return this;
        }

        public Builder withWatched(Boolean watched) {
            this.watched = watched;
            return this;
        }

        public ContentModel build() {
            return new ContentModel(contentId, watchlistId, title, userId, streamService, watched);
        }
    }
}
