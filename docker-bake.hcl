# Builds both images in one BuildKit session. CI sets SHA and LATEST.
variable "REPO" {
  default = "jeetgr/shortlist"
}

variable "SHA" {
  default = "local"
}

# "true" only on the default branch, so other refs never move `latest`.
variable "LATEST" {
  default = "false"
}

group "default" {
  targets = ["image"]
}

target "image" {
  name      = t
  matrix    = { t = ["app", "migrate"] }
  context   = "."
  target    = t
  platforms = ["linux/amd64"]
  tags = concat(
    ["ghcr.io/${lower(REPO)}-${t}:sha-${substr(SHA, 0, 7)}"],
    equal(LATEST, "true") ? ["ghcr.io/${lower(REPO)}-${t}:latest"] : []
  )
  # One cache per image: targets sharing a scope would overwrite each other's cache.
  cache-from = ["type=gha,scope=${t}"]
  cache-to   = ["type=gha,scope=${t},mode=max"]
}
