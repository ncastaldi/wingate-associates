type BookingPanelProps = {
  // Public https URL of the booking page on the self-hosted scheduler, or null before it is live.
  bookingUrl: string | null;
};

export function BookingPanel({ bookingUrl }: BookingPanelProps) {
  return (
    <section aria-labelledby="booking-heading">
      <h2 id="booking-heading">Book a call</h2>
      {bookingUrl ? (
        <>
          <p>Pick a time for a free 30-minute call. I will confirm by email.</p>
          <iframe
            src={bookingUrl}
            title="Book a 30-minute call"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
          <p>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Open the booking page in a new tab
            </a>
          </p>
        </>
      ) : (
        <p>
          Every engagement starts with a free 30-minute call. Online booking is coming. Until then,
          send a message and name a few times that suit you.
        </p>
      )}
    </section>
  );
}
