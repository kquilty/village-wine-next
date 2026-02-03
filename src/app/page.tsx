import Hero from "@/components/Hero";
import InfoGrid from "@/components/InfoGrid";
import EventList from "@/components/EventList";
import OfferGrid from "@/components/OfferGrid";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="container">
            <Hero />
            <InfoGrid />
            <EventList />
            <OfferGrid />
            <Footer />
        </main>
    );
}