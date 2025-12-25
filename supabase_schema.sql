-- PROJECTS TABLE
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  name text not null,
  category text check (category in ('Web', 'App', 'AI', 'College', 'Client')),
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  status text check (status in ('Not Started', 'In Progress', 'Completed', 'Dropped')) default 'Not Started',
  start_date date,
  due_date date,
  expected_days integer,
  actual_days integer
);

-- TASKS TABLE
create table tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) not null,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')),
  priority text check (priority in ('Low', 'Medium', 'High')),
  status text check (status in ('Not Started', 'In Progress', 'Review', 'Completed')) default 'Not Started',
  due_date date,
  estimated_hours numeric,
  actual_hours numeric
);

-- ENABLE ROW LEVEL SECURITY
alter table projects enable row level security;
alter table tasks enable row level security;

-- POLICIES FOR PROJECTS
create policy "Users can view their own projects" 
  on projects for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own projects" 
  on projects for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own projects" 
  on projects for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own projects" 
  on projects for delete 
  using (auth.uid() = user_id);

-- POLICIES FOR TASKS
create policy "Users can view their own tasks" 
  on tasks for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks" 
  on tasks for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks" 
  on tasks for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks" 
  on tasks for delete 
  using (auth.uid() = user_id);
