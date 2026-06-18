import os
import sys
import getpass

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def main():
    print("====================================================")
    print("      NovaBasket Supabase DB Migrations Runner       ")
    print("====================================================")
    
    password = getpass.getpass("Enter your Supabase Database Password: ")
    if not password:
        print("Password cannot be empty!")
        sys.exit(1)
        
    # Override database configuration environment variables
    os.environ['DB_NAME'] = 'postgres'
    os.environ['DB_USER'] = 'postgres.jerkrgdlvpequzqcogxe'
    os.environ['DB_HOST'] = 'aws-1-ap-northeast-1.pooler.supabase.com'
    os.environ['DB_PORT'] = '6543'
    os.environ['DB_PASSWORD'] = password
    
    print("\nConnecting to Supabase and running migrations...")
    try:
        import django
        django.setup()
        
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'migrate'])
        print("\n✅ Migrations applied successfully to Supabase!")
    except Exception as e:
        print(f"\n❌ Error running migrations: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
