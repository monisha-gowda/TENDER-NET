/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getParticipantRegistry */

/**
 * Close the bidding for a tender listing and choose the
 * lowest bid that is under the asking price
 * @param {org.acme.tender.auction.CloseBidding} closeBidding - the closeBidding transaction
 * @transaction
 */
async function closeBidding(closeBidding) {  // eslint-disable-line no-unused-vars
    const listing = closeBidding.listing;
    if (listing.state !== 'OPEN') {
        throw new Error('NOT OPEN');
    }
    // by default we mark the listing as RESERVE_NOT_MET
    listing.state = 'RESERVE_NOT_MET';
    let lowestOffer = null;
    let contractor = null;
    let department = null;
    if (listing.offers && listing.offers.length > 0) {
        // sort the bids by bidPrice
        listing.offers.sort(function(a, b) {
            return (a.bidPrice - b.bidPrice);
        });
        lowestOffer = listing.offers[0];
        if (lowestOffer.bidPrice <= listing.reservePrice) {
            // mark the listing as SOLD
            listing.state = 'CLOSED';
            contractor = lowestOffer.member;
            department = listing.tender.owner;
            
            // transfer the tender to the contractor
            listing.tender.owner = contractor;
            // clear the offers
            listing.offers = null;
        }
    }

    if (lowestOffer) {
        // save the tender
        const tenderRegistry = await getAssetRegistry('org.acme.tender.auction.Tender');
        await tenderRegistry.update(listing.tender);
    }

    // save the tender listing
    const tenderListingRegistry = await getAssetRegistry('org.acme.tender.auction.TenderListing');
    await tenderListingRegistry.update(listing);

    if (listing.state === 'CLOSED') {
        // save the contractor
        const userRegistry = await getParticipantRegistry('org.acme.tender.auction.Member');
        await userRegistry.updateAll([contractor, department]);
    }
}

/**
 * Make an Offer for a TenderListing
 * @param {org.acme.tender.auction.Offer} offer - the offer
 * @transaction
 */
async function makeOffer(offer) {  // eslint-disable-line no-unused-vars
    let listing = offer.listing;
    if (listing.state !== 'OPEN') {
        throw new Error('Listing is not FOR SALE');
    }
    if (!listing.offers) {
        listing.offers = [];
    }
    if(listing.tender.owner == offer.member){
        throw new Error("Owner can't bid");
    }
    for (var i = 0; i < listing.offers.length; i++) {
        if(listing.offers[i].member == offer.member){
            throw new Error('Your bid has already been submitted');
        }
    }
    listing.offers.push(offer);

    // save the tender listing
    const tenderListingRegistry = await getAssetRegistry('org.acme.tender.auction.TenderListing');
    await tenderListingRegistry.update(listing);
}
