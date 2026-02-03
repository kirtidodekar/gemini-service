import dotenv from 'dotenv';
dotenv.config();

async function testLocal() {
    // Example: A publicly available image of straw/crop residue
    const TEST_IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rice_straw_in_the_field.jpg/640px-Rice_straw_in_the_field.jpg";

    // Or you can test with a base64 string if you prefer
    // const TEST_BASE64 = "data:image/jpeg;base64,...";

    console.log("Testing with image URL:", TEST_IMAGE_URL);

    // Simulate the function call logic or do an actual fetch if localhost server was running
    // Since this is a test script, we can import the library logic directly to test the core independently

    try {
        const { analyzeImage } = await import('../lib/gemini.js');
        console.log("Calling analyzeImage...");
        const result = await analyzeImage(TEST_IMAGE_URL);
        console.log("\n--- Analysis Result ---\n");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testLocal();
