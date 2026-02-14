const http = require('http');

function fetch(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}

async function verify() {
    try {
        console.log('Fetching categories from 127.0.0.1...');
        const categories = await fetch('http://127.0.0.1:8080/api/categories');

        if (!categories.data) {
            console.error('Invalid response format', categories);
            return;
        }

        const shoesCategory = categories.data.find(c => c.slug === 'shoes');

        if (!shoesCategory) {
            console.error('Shoes category not found!', categories.data);
            return;
        }
        console.log(`Found Shoes category ID: ${shoesCategory.id}`);

        console.log('Fetching products for Shoes category...');
        const products = await fetch(`http://127.0.0.1:8080/api/products?categoryId=${shoesCategory.id}`);

        if (!products.data || !products.data.content) {
            console.error('Invalid products response', products);
            return;
        }

        console.log(`Fetched ${products.data.content.length} products.`);
        products.data.content.forEach(p => {
            if (p.categoryId !== shoesCategory.id) {
                console.error(`ERROR: Product ${p.name} has wrong category ID: ${p.categoryId}`);
            } else {
                console.log(`OK: Product ${p.name} is in correct category (${p.categoryName}).`);
            }
        });

    } catch (error) {
        console.error('Verification failed:', error.message);
    }
}

verify();
