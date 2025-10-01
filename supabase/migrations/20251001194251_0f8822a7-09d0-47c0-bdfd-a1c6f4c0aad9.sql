-- Add foreign key constraints with CASCADE DELETE for agent_memory
ALTER TABLE agent_memory
DROP CONSTRAINT IF EXISTS agent_memory_agent_id_fkey,
ADD CONSTRAINT agent_memory_agent_id_fkey 
  FOREIGN KEY (agent_id) 
  REFERENCES executive_agents(id) 
  ON DELETE CASCADE;

-- Add foreign key constraints with CASCADE DELETE for hip_configurations
ALTER TABLE hip_configurations
DROP CONSTRAINT IF EXISTS hip_configurations_user_id_fkey,
ADD CONSTRAINT hip_configurations_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add DELETE policy for executive_agents
CREATE POLICY "Users can delete their own agent" 
ON executive_agents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add DELETE policy for agent_memory
CREATE POLICY "Users can delete their agent memory" 
ON agent_memory 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM executive_agents 
  WHERE executive_agents.id = agent_memory.agent_id 
  AND executive_agents.user_id = auth.uid()
));

-- Add DELETE policy for hip_configurations
CREATE POLICY "Users can delete their own hip config" 
ON hip_configurations 
FOR DELETE 
USING (auth.uid() = user_id);