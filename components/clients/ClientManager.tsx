import { useState } from 'react';
import CreateClientModal from './CreateClientModal';

interface Client {
  id: string;
  name: string;
  secret?: string;
  createdAt: Date;
  lastSeenAt?: Date;
  activations: number;
  status: 'active' | 'revoked';
}

interface ClientManagerProps {
  clients: Client[];
}

export default function ClientManager({ clients }: ClientManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Client | null>(null);

  const handleCreateClient = (client: Client) => {
    setNewClient(client);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Clients</h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          Create New Client
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500">No clients created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client.id} className="card p-4">
              <h3 className="font-bold">{client.name}</h3>
              <p className="text-sm text-gray-500">
                Created: {new Date(client.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Status: <span className={client.status === 'active' ? 'text-green-500' : 'text-red-500'}>
                  {client.status}
                </span>
              </p>
              <p className="text-sm">Activations: {client.activations}</p>
              {client.lastSeenAt && (
                <p className="text-sm">
                  Last seen: {new Date(client.lastSeenAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {newClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="font-bold text-lg mb-2">Client Created</h3>
            <p>Client ID: {newClient.id}</p>
            {newClient.secret && (
              <div className="mt-2">
                <p className="font-medium">Client Secret:</p>
                <p className="font-mono bg-gray-100 p-2 rounded">{newClient.secret}</p>
                <p className="text-sm text-red-500 mt-1">
                  Save this secret now. It will not be shown again.
                </p>
              </div>
            )}
            <button
              className="btn-primary mt-4"
              onClick={() => setNewClient(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <CreateClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateClient}
      />
    </div>
  );
}
