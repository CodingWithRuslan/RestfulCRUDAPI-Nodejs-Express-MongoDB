window.addEventListener('DOMContentLoaded', async () => {
    const productsDiv = document.getElementById('products');

    try {
        const response = await fetch('/products');
        const products = await response.json();
        
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <h2>${product.name}</h2>
                <p>Quantity: ${product.quantity}</p>
                <p>Price: $${product.price}</p>
                <img src="${product.image}" alt="${product.name}" width="200">
                <button data-product-id="${product._id}">Delete</button>
            `;
            productsDiv.appendChild(productDiv);
        });
        
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }

    // Listen for delete button clicks using event delegation
    productsDiv.addEventListener('click', async (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.hasAttribute('data-product-id')) {
            const productId = e.target.getAttribute('data-product-id');
            await deleteProduct(productId);
        }
    });

    // Add Product logic
    document.getElementById("addProductForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const quantity = document.getElementById("quantity").value;
        const price = document.getElementById("price").value;
        const image = document.getElementById("image").value;

        try {
            const response = await fetch("/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, quantity, price, image })
            });
            const data = await response.json();
            if (response.status === 201) {
                alert("Product added successfully");
                location.reload(); // Reload the page to see the new product
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            alert('Product deleted successfully!');
            location.reload();  // Refresh the page to reflect the deletion
        } else {
            const data = await response.json();
            alert('Failed to delete product: ' + data.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
}
