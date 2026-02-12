import Hero from "@/components/Hero";
import InfoGrid from "@/components/InfoGrid";
import Promotions from "@/components/Promotions";
import EventList from "@/components/EventList";
import OfferGrid from "@/components/OfferGrid";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { promotions } from "@/lib/promotions";

export default function Home() {
    return (
        <div className="page-shell" id="top">
            <SiteNav hasPromotions={promotions.length > 0} />
            <main className="container">
                <Hero />
                <InfoGrid />
                <EventList />
                <Promotions />
                <OfferGrid />
                <Footer />
            </main>
        </div>
    );
}