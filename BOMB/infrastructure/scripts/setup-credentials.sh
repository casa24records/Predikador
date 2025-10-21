#!/bin/bash

# ============================================
# Casa 24 Records - Credential Setup Script
# ============================================
# This script helps set up credentials securely
# for different deployment environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main menu
show_menu() {
    clear
    echo "============================================"
    echo "   Casa 24 Records - Credential Manager"
    echo "============================================"
    echo ""
    echo "Select deployment target:"
    echo ""
    echo "1) Local Development (Docker Compose)"
    echo "2) GitHub Secrets (CI/CD)"
    echo "3) AWS Secrets Manager"
    echo "4) HashiCorp Vault"
    echo "5) Kubernetes Secrets"
    echo "6) Azure Key Vault"
    echo "7) Google Secret Manager"
    echo "0) Exit"
    echo ""
    read -p "Enter your choice: " choice
}

# Setup local environment
setup_local() {
    print_status "Setting up local environment..."

    # Check if .env.template exists
    if [ ! -f "../../.env.template" ]; then
        print_error ".env.template not found!"
        exit 1
    fi

    # Check if .env already exists
    if [ -f "../../.env" ]; then
        print_warning ".env file already exists!"
        read -p "Do you want to overwrite it? (y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            print_status "Keeping existing .env file"
            return
        fi
    fi

    # Copy template
    cp ../../.env.template ../../.env
    print_status "Created .env file from template"

    # Interactive credential setup
    echo ""
    echo "Please enter your credentials:"
    echo "(Press Enter to skip optional fields)"
    echo ""

    # Discord credentials
    read -p "Discord Bot Token: " discord_token
    if [ ! -z "$discord_token" ]; then
        sed -i "s/YOUR_DISCORD_BOT_TOKEN_HERE/$discord_token/g" ../../.env
        print_status "Discord token configured"
    fi

    read -p "Discord Client ID: " discord_client
    if [ ! -z "$discord_client" ]; then
        sed -i "s/YOUR_DISCORD_CLIENT_ID_HERE/$discord_client/g" ../../.env
        print_status "Discord client ID configured"
    fi

    read -p "Discord Guild ID: " discord_guild
    if [ ! -z "$discord_guild" ]; then
        sed -i "s/YOUR_DISCORD_GUILD_ID_HERE/$discord_guild/g" ../../.env
        print_status "Discord guild ID configured"
    fi

    # Spotify credentials (optional)
    echo ""
    print_warning "Spotify credentials (optional)"
    read -p "Spotify Client ID: " spotify_client
    if [ ! -z "$spotify_client" ]; then
        sed -i "s/YOUR_SPOTIFY_CLIENT_ID_HERE/$spotify_client/g" ../../.env
    fi

    read -p "Spotify Client Secret: " spotify_secret
    if [ ! -z "$spotify_secret" ]; then
        sed -i "s/YOUR_SPOTIFY_CLIENT_SECRET_HERE/$spotify_secret/g" ../../.env
    fi

    # Set file permissions
    chmod 600 ../../.env
    print_status "Set secure file permissions (600) on .env"

    echo ""
    print_status "Local environment setup complete!"
    print_warning "Remember: Never commit .env to Git!"
}

# Setup GitHub Secrets
setup_github() {
    print_status "Setting up GitHub Secrets..."

    # Check if gh CLI is installed
    if ! command_exists gh; then
        print_error "GitHub CLI (gh) is not installed!"
        echo "Install from: https://cli.github.com/"
        exit 1
    fi

    # Check if authenticated
    if ! gh auth status >/dev/null 2>&1; then
        print_warning "Not authenticated with GitHub"
        gh auth login
    fi

    # Get repository name
    repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
    print_status "Repository: $repo"

    echo ""
    echo "Enter credentials to store in GitHub Secrets:"
    echo ""

    # Discord Bot Token
    read -s -p "Discord Bot Token: " discord_token
    echo ""
    if [ ! -z "$discord_token" ]; then
        echo "$discord_token" | gh secret set DISCORD_BOT_TOKEN
        print_status "DISCORD_BOT_TOKEN added to GitHub Secrets"
    fi

    # Discord Client ID
    read -p "Discord Client ID: " discord_client
    if [ ! -z "$discord_client" ]; then
        echo "$discord_client" | gh secret set DISCORD_CLIENT_ID
        print_status "DISCORD_CLIENT_ID added to GitHub Secrets"
    fi

    # Discord Guild ID
    read -p "Discord Guild ID: " discord_guild
    if [ ! -z "$discord_guild" ]; then
        echo "$discord_guild" | gh secret set DISCORD_GUILD_ID
        print_status "DISCORD_GUILD_ID added to GitHub Secrets"
    fi

    # Optional: API Keys
    echo ""
    read -p "Add API keys? (y/n): " add_apis
    if [ "$add_apis" = "y" ]; then
        read -s -p "Spotify Client ID: " spotify_id
        echo ""
        [ ! -z "$spotify_id" ] && echo "$spotify_id" | gh secret set SPOTIFY_CLIENT_ID

        read -s -p "Spotify Client Secret: " spotify_secret
        echo ""
        [ ! -z "$spotify_secret" ] && echo "$spotify_secret" | gh secret set SPOTIFY_CLIENT_SECRET

        read -s -p "YouTube API Key: " youtube_key
        echo ""
        [ ! -z "$youtube_key" ] && echo "$youtube_key" | gh secret set YOUTUBE_API_KEY
    fi

    echo ""
    print_status "GitHub Secrets setup complete!"
    echo "View secrets at: https://github.com/$repo/settings/secrets/actions"
}

# Setup AWS Secrets Manager
setup_aws() {
    print_status "Setting up AWS Secrets Manager..."

    # Check if AWS CLI is installed
    if ! command_exists aws; then
        print_error "AWS CLI is not installed!"
        echo "Install from: https://aws.amazon.com/cli/"
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS credentials not configured!"
        echo "Run: aws configure"
        exit 1
    fi

    # Create secret
    secret_name="casa24/discord-bot"
    region=$(aws configure get region)

    echo ""
    echo "Creating secret: $secret_name in region: $region"
    echo ""

    # Collect credentials
    read -s -p "Discord Bot Token: " discord_token
    echo ""
    read -p "Discord Client ID: " discord_client
    read -p "Discord Guild ID: " discord_guild

    # Create JSON
    secret_json=$(cat <<EOF
{
  "DISCORD_BOT_TOKEN": "$discord_token",
  "DISCORD_CLIENT_ID": "$discord_client",
  "DISCORD_GUILD_ID": "$discord_guild"
}
EOF
)

    # Create or update secret
    if aws secretsmanager describe-secret --secret-id "$secret_name" >/dev/null 2>&1; then
        aws secretsmanager put-secret-value \
            --secret-id "$secret_name" \
            --secret-string "$secret_json"
        print_status "Updated existing secret: $secret_name"
    else
        aws secretsmanager create-secret \
            --name "$secret_name" \
            --secret-string "$secret_json"
        print_status "Created new secret: $secret_name"
    fi

    echo ""
    print_status "AWS Secrets Manager setup complete!"
    echo "ARN: arn:aws:secretsmanager:$region:$(aws sts get-caller-identity --query Account --output text):secret:$secret_name"
}

# Setup Kubernetes Secrets
setup_kubernetes() {
    print_status "Setting up Kubernetes Secrets..."

    # Check if kubectl is installed
    if ! command_exists kubectl; then
        print_error "kubectl is not installed!"
        echo "Install from: https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi

    # Check cluster connection
    if ! kubectl cluster-info >/dev/null 2>&1; then
        print_error "Not connected to a Kubernetes cluster!"
        exit 1
    fi

    # Get namespace
    read -p "Namespace (default: default): " namespace
    namespace=${namespace:-default}

    echo ""
    echo "Creating secret in namespace: $namespace"
    echo ""

    # Collect credentials
    read -s -p "Discord Bot Token: " discord_token
    echo ""
    read -p "Discord Client ID: " discord_client
    read -p "Discord Guild ID: " discord_guild

    # Create secret
    kubectl create secret generic discord-credentials \
        --from-literal=DISCORD_BOT_TOKEN="$discord_token" \
        --from-literal=DISCORD_CLIENT_ID="$discord_client" \
        --from-literal=DISCORD_GUILD_ID="$discord_guild" \
        --namespace="$namespace" \
        --dry-run=client -o yaml | kubectl apply -f -

    print_status "Kubernetes secret created/updated"

    echo ""
    print_status "Kubernetes Secrets setup complete!"
    echo "View with: kubectl get secret discord-credentials -n $namespace -o yaml"
}

# Main loop
while true; do
    show_menu

    case $choice in
        1)
            setup_local
            ;;
        2)
            setup_github
            ;;
        3)
            setup_aws
            ;;
        4)
            print_warning "HashiCorp Vault setup not yet implemented"
            echo "See: https://www.vaultproject.io/docs"
            ;;
        5)
            setup_kubernetes
            ;;
        6)
            print_warning "Azure Key Vault setup not yet implemented"
            echo "See: https://azure.microsoft.com/en-us/services/key-vault/"
            ;;
        7)
            print_warning "Google Secret Manager setup not yet implemented"
            echo "See: https://cloud.google.com/secret-manager"
            ;;
        0)
            echo "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option!"
            ;;
    esac

    echo ""
    read -p "Press Enter to continue..."
done