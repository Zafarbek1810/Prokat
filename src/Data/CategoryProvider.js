import client from "../HHTP/client";

export default class CategoryProvider {

    // Get all categories (both main and sub)
    static async getAllCategory() {
        return await client.get(`/api/admin/categories/`);
    }

    // Get only main categories
    static async getMainCategories() {
        return await client.get(`/api/admin/categories/?type=main`);
    }

    // Get only subcategories
    static async getSubcategories() {
        return await client.get(`/api/admin/categories/?type=sub`);
    }

    // Get subcategories for a specific main category
    static async getSubcategoriesByParent(parentId) {
        return await client.get(`/api/admin/categories/?parent_id=${parentId}`);
    }

    // Get all categories with specific language
    static async getAllCategoryWithLanguage(language = 'ru', type = null) {
        console.log(`Getting categories with language: ${language}, type: ${type}`);
        try {
            let url = `/api/admin/categories/`;
            if (type) {
                url += `?type=${type}`;
            }
            const response = await client.get(url, {
                headers: {
                    'Accept-Language': language
                }
            });
            console.log(`Success getting categories with ${language}, count:`, response?.data?.results?.length || response?.data?.length);
            return response;
        } catch (error) {
            console.error(`Error getting categories with language ${language}:`, error);
            throw error;
        }
    }

    // Create category (main or subcategory based on parent field)
    static async createCategory(body) {
        return await client.post("/api/admin/categories/", body);
    }

    // Delete category
    static async deleteCategory(id) {
        return await client.delete(`/api/admin/categories/${id}/`);
    }

    // Get one category
    static async getOneCategory(id) {
        return await client.get(`/api/admin/categories/${id}/`);
    }

    // Get category with specific language
    static async getOneCategoryWithLanguage(id, language = 'ru') {
        const url = `/api/admin/categories/${id}/`;
        console.log(`Fetching category ${id} with language: ${language}`);
        try {
            const response = await client.get(url, {
                headers: {
                    'Accept-Language': language
                }
            });
            console.log(`Success fetching with language ${language}:`, response.data);
            return response;
        } catch (error) {
            console.error(`Error fetching category ${id} with language ${language}:`, error.response?.status, error.response?.data);
            throw error;
        }
    }

    // Update category
    static async updateCategory(id, body) {
        return await client.put(`/api/admin/categories/${id}/`, body);
    }

    // Partial update (e.g., order)
    static async updateCategoryOrder(id, body) {
        return await client.patch(`/api/admin/categories/${id}/`, body);
    }
}
