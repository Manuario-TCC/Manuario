import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

export const getNeo4jDriver = () => {
    if (!driver) {
        const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
        const user = process.env.NEO4J_USER || 'neo4j';
        const password = process.env.NEO4J_PASSWORD || '123456789';

        driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

        console.log(' Driver do Neo4j inicializado!');
    }

    return driver;
};

export const closeNeo4jDriver = async () => {
    if (driver) {
        await driver.close();
        console.log('Driver do Neo4j fechado.');
    }
};