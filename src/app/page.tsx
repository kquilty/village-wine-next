import Hero from "@/components/Hero";
import InfoGrid from "@/components/InfoGrid";
import Promotions from "@/components/Promotions";
import EventList from "@/components/EventList";
import OfferGrid from "@/components/OfferGrid";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="container">
            <Hero />
            <InfoGrid />
            <EventList />
            <Promotions />
            <OfferGrid />
            <Footer />
        </main>
    );
}