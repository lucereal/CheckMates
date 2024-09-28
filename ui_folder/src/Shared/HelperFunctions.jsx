export function getClaimedTotal(items, tip, tax) {
    if (!items.length) return 0;

    let claimedTotal = 0.0;
    for (const item of items) {
        // If the claims array has people, then we should add it to the total
        if (item.claims.length) {
            claimedTotal += item.price;
        }
    }
    return claimedTotal;
}

export function getUserClaimedTotal(items, user) {

    console.log("in getUserClaimedTotal");
    console.log(user);

    if (!items.length) return 0;

    let claimedTotal = 0.0;
    for (const item of items) {
        // If the claims array has people, then we should add it to the total
        if (item.claims.length) {
            for(const claim of item.claims) {
                if (claim.userId === user.userId) {
                    claimedTotal += item.price/item.claims.length;
                }
            }
        }
    }
    return claimedTotal;
}

// Gotta make a dictionary where the key is the user, have the value be a dictionary of values
// a claimedTotal value, items dictionary which has the names and their total.
// last note: Include the tip divided by the total amount of people
export function summarize(users, items, tip, tax) {

    console.log("in summarize");

    if (!users?.length || !items?.length) return;

    const summaryDict = {};
    let dividedTip = 0.0;
    let dividedTax = 0.0;

    if (tip) {
        dividedTip = parseFloat((tip / users.length).toFixed(2));
    }

    if (tax) {
        dividedTax = parseFloat((tax / users.length).toFixed(2));
    }

    // Set the initial values for each user, and set tip while we are iterating.
    for (let user of users) {
        summaryDict[user.userId] = {
            claimedTotal: 0.0,
            sharedTip: dividedTip,
            sharedTax: dividedTax,
            claimedItems: []
        }
    }

    for (let item of items) {
        const claimedNumber = item.claims.length;
         // not claimed by anybody? move on.
        if (claimedNumber <= 0){
            continue;
        }
        // First check the users
        for (let claim of item.claims) {
            // Add prices.
            const price = parseFloat((item.price / claimedNumber));
            summaryDict[claim.userId].claimedTotal += ((price * 100) / 100);

            // Now populate the items obj.
            summaryDict[claim.userId].claimedItems.push({
                name: item.description,
                price: price,
                split: claimedNumber // Number of people split with. 1 means not split.
            })
        }
    }

    return summaryDict;
}

export const copyToClipboard = (ref, setter) => {
    navigator.clipboard.writeText(ref.current.value).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        setter("Copied!");
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

export const getUrlId = () => {
    let id = window.location.search;
    if (id.indexOf('=') !== -1) {
        return id.split('=')[1];
    }

    return "";
}