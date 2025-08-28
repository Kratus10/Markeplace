# Terraform configuration for Marketplace Infrastructure

provider "aws" {
  region = var.aws_region
}

# R2 Storage (Cloudflare) - Example configuration
resource "cloudflare_r2_bucket" "marketplace_storage" {
  account_id = var.cloudflare_account_id
  name       = var.r2_bucket_name
}

# Managed PostgreSQL Database (AWS RDS example)
resource "aws_db_instance" "marketplace_db" {
  identifier             = "marketplace-db"
  engine                 = "postgres"
  engine_version         = "15"
  instance_class         = var.db_instance_class
  allocated_storage      = 20
  storage_type           = "gp3"
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  publicly_accessible    = false
}

# Redis Cache (Upstash example)
resource "upstash_redis_database" "marketplace_cache" {
  database_name = "marketplace-cache"
  region        = var.redis_region
  tls           = true
}

# Netlify Site Configuration
resource "netlify_site" "marketplace" {
  name = "trading-tools-marketplace"
}

# DNS Configuration (Cloudflare example)
resource "cloudflare_record" "marketplace_dns" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  value   = netlify_site.marketplace.cname
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

# Security Group for Database
resource "aws_security_group" "db_sg" {
  name        = "marketplace-db-sg"
  description = "Allow inbound from application servers"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Restrict to known IPs in production
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Variables
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "r2_bucket_name" {
  description = "R2 bucket name for storage"
  type        = string
  default     = "marketplace-storage"
}

variable "db_instance_class" {
  description = "DB instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "redis_region" {
  description = "Redis region"
  type        = string
  default     = "us-east-1"
}

variable "cloudflare_zone_id" {
  description = "Cloudflare DNS zone ID"
  type        = string
}
