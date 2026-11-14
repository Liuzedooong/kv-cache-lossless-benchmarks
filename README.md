# KVCompBench

**KV Cache Compression Benchmark**

KVCompBench is an extensible benchmarking project for KV cache compression in LLM serving. Our goal is to evaluate codecs under consistent data layouts, frame boundaries, correctness requirements, and performance accounting.

**We are starting with lossless compression.** The first stage focuses on a reproducible lossless benchmark for BF16 and FP8 KV data; support for additional compression approaches is future work, not a claim of current functionality.

## Active development: lossless

The ongoing work lives in the **[KVCompBench-lossless branch](https://github.com/Liuzedooong/KVCompBench/tree/KVCompBench-lossless)**. It covers:

- Byte-exact KV reconstruction and clear treatment of auxiliary scales and metadata.
- Compression ratio for independently decodable KV pages / chunks.
- CPU encoding and GPU decoding throughput, with transport measured separately.
- BF16, FP8 E4M3FN/E5M2, K/V and shared-latent KV layouts.
- Model, layer, page-size, and preprocessing sensitivity.

The current public release is an **FP8 lossless compression study and its figures**; a reusable benchmark harness and full machine-readable results are still planned for release, rather than already available in this repository.

**Project website:** [KVCompBench](https://liuzedooong.github.io/KVCompBench/)

**First study:** [Lossless Compression of FP8 KV Caches: What Actually Helps?](https://liuzedooong.github.io/KVCompBench/blog/fp8-lossless-2026/)

## Roadmap

1. Establish lossless benchmark infrastructure and reproducible codec comparisons.
2. Extend verified BF16 / FP8 results, GPU codec backends, and integration with KV storage/serving systems.
3. Explore other KV compression approaches and relevant tradeoffs after the lossless foundation is established.

For feedback or collaboration, [open an issue](https://github.com/Liuzedooong/KVCompBench/issues). The project is independent and not an official LMCache release.
