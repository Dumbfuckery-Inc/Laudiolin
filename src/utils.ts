import type { TrackData } from "@backend/types";

import { favorites } from "@backend/user";
import { Gateway } from "@app/constants";
import { playTrack } from "@backend/audio";
import { fetchTrackById } from "@backend/search";
import * as settings from "@backend/settings";

import * as fs from "@mod/fs";
import TrackPlayer from "@mod/player";

/**
 * Matches the icon URL to the correct proxy URL.
 * @param track The track to get the icon URL for.
 */
export function getIconUrl(track: TrackData): string {
    const icon = track.icon;
    // Check if the icon is already a proxy.
    if (icon.includes("/proxy/")) return icon;
    // Check if the icon is a local image.
    if (icon.includes("asset.localhost"))
        return fs.toAsset(fs.getIconPath(track));
    // Check if the icon is blank.
    if (icon == "") return fs.toAsset(fs.getIconPath(track));

    let url = `${Gateway.url}/proxy/{ico}?from={src}`;
    // Match the icon URL to the correct proxy URL.
    const iconUrl = track.icon;
    let split = iconUrl.split("/");

    if (iconUrl.includes("i.ytimg.com")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "yt");
    }
    if (iconUrl.includes("i.scdn.co")) {
        return url
            .replace("{ico}", split[4])
            .replace("{src}", "spot");
    }
    if (iconUrl.includes("lh3.googleusercontent.com")) {
        return url
            .replace("{ico}", split[3])
            .replace("{src}", "cart");
    }

    console.warn(`Encountered a weird icon URL! ${icon}`); return url;
}

/**
 * Formats the duration into hh:mm:ss.
 * @param seconds The duration in seconds.
 */
export function formatDuration(seconds: number): string {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    } else {
        return `${mm}:${ss}`;
    }
}

/**
 * Checks if the track is a favorite.
 * @param track The track to check.
 */
export function isFavorite(track: TrackData|null): boolean {
    return track ? favorites.find(t => t.id == track?.id) != null : false;
}

/**
 * Saves the current player state to the local storage.
 */
export function savePlayerState(): void {
    // Get the current track.
    const track = TrackPlayer.getCurrentTrack()?.data;

    // Check if the track is valid.
    if (track)
        // Save the current track.
        settings.save("player.currentTrack", track.id);
    else
        // Remove the current track.
        settings.remove("player.currentTrack");
}

/**
 * Loads the player state from the local storage.
 */
export async function loadPlayerState(): Promise<void> {
    // Check if a track is saved.
    const track = settings.get("player.currentTrack");
    // Check if the track is valid.
    if (!track) return;

    // Get the track as a serialized data object.
    const data = await fetchTrackById(track);
    // Check if the track is valid.
    if (!data) return;

    // Add the track to the queue.
    await playTrack(data, false, false);
    // Pause the player.
    TrackPlayer.pause();
    // Remove the track from the local storage.
    settings.remove("player.currentTrack");
}
