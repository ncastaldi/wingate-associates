import { describe, expect, it } from "vitest";
import { getBookingUrl } from "@/lib/booking";

describe("getBookingUrl", () => {
  it("returns null when unset or blank", () => {
    expect(getBookingUrl({})).toBeNull();
    expect(getBookingUrl({ BOOKING_URL: "  " })).toBeNull();
  });

  it("returns an https URL as given", () => {
    const url = "https://cal.wingate.associates/nathan/intro";
    expect(getBookingUrl({ BOOKING_URL: url })).toBe(url);
  });

  it("ignores http URLs and junk so the contact page still renders", () => {
    expect(getBookingUrl({ BOOKING_URL: "http://cal.wingate.associates/x" })).toBeNull();
    expect(getBookingUrl({ BOOKING_URL: "not a url" })).toBeNull();
  });
});
