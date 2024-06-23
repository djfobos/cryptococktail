const tgid = '666';

class Api {
    constructor() 
    {
        this.baseUrl = 'http://localhost:8000/api';

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
        this.headers.append('X-Telegram-Token', tgid);

        this.fetch = window.fetch.bind(window);
    }

    async getUser() 
    {
        try 
        {
            const response = await this.fetch(`${this.baseUrl}/user`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } 
        catch (error) 
        {
            console.error('Error fetching user data:', error);
        }
    }

    async getBalance(balanceType = 'general')
    {
        try 
        {
            const response = await this.fetch(`${this.baseUrl}/user/balance/${balanceType}`, {
                method: 'GET',
                headers: this.headers,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } 
        catch (error) 
        {
            console.error('Error fetching balance:', error);
        }
    }
}

export default Api;
// const api = new Api();
